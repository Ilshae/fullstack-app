package com.praca_inzynierska.backend.reservation;

import com.praca_inzynierska.backend.auth.user.responseBody.MessageResponse;
import com.praca_inzynierska.backend.client.Client;
import com.praca_inzynierska.backend.client.ClientRepository;
import com.praca_inzynierska.backend.client.responseBody.CNoIds;
import com.praca_inzynierska.backend.price.Price;
import com.praca_inzynierska.backend.price.PriceRepository;
import com.praca_inzynierska.backend.reservation.responseBody.*;
import com.praca_inzynierska.backend.yacht.Yacht;
import com.praca_inzynierska.backend.yacht.YachtRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class ReservationController {
  final ReservationRepository reservationRepository;
  final YachtRepository yachtRepository;
  final PriceRepository priceRepository;
  final ClientRepository clientRepository;

  public ReservationController(ReservationRepository reservationRepository, YachtRepository yachtRepository, PriceRepository priceRepository, ClientRepository clientRepository) {
    this.reservationRepository = reservationRepository;
    this.yachtRepository = yachtRepository;
    this.priceRepository = priceRepository;
    this.clientRepository = clientRepository;
  }

  @GetMapping("/reservations")
  public ResponseEntity<?> getReservationsByYachtId(@RequestParam() long yachtId) {
    try {
      List<RNoForeignIds> reservations = new ArrayList<>(reservationRepository.findByYachtId(yachtId));
      return new ResponseEntity<>(reservations, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/reservations/yachtName")
  public ResponseEntity<?> getYachtNameByReservationId(@RequestParam() long id) {
    try {
      return new ResponseEntity<>(yachtRepository.findYachtNameByReservationId(id), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/reservations/{id}")
  public ResponseEntity<?> getReservationById(@PathVariable("id") long id) {
    try {
      RNoIds reservation = reservationRepository.findResForAdminPanelEdit(id);
      CNoIds client = clientRepository.findClientByResId(id);
      return new ResponseEntity<>(new RAndCObjectForEdit(reservation, client), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/disabledDates")
  public ResponseEntity<?> getDisabledDates(@RequestParam() long yachtId) {
    try {
      List<RDates> reservations = new ArrayList<>(reservationRepository.findDisabledDatesByYachtId(yachtId));
      return new ResponseEntity<>(reservations, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/reservations")
  public ResponseEntity<?> createReservation(@Valid @RequestBody RAndCWithYachtId reservation) {
    try {
      Yacht yacht;
      if (yachtRepository.findById(reservation.getYachtId()).isPresent())
        yacht = yachtRepository.findById(reservation.getYachtId()).get();
      else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);

      double sumPrice = 0d;
      Optional<Price> price;
      for (LocalDate date = reservation.getStartDate(); !date.isAfter(reservation.getEndDate()); date = date.plusDays(1)) {
        if (reservationRepository.findIfReserved(date, yacht.getId()) > 0) return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: One of selected dates is already reserved!"));

        price = Optional.ofNullable(priceRepository.findByYachtIdAndDate(reservation.getYachtId(), date));
        if (price.isEmpty()) {
          sumPrice = 0d;
          break;
        }
        sumPrice = sumPrice + price.get().getPrice();
      }

      Reservation _reservation = reservationRepository.save(new Reservation(reservation.getStartDate(), reservation.getEndDate(), sumPrice, reservation.getMessage()));
      Client client = clientRepository.save(new Client(reservation.getFirstname(), reservation.getLastname(), reservation.getEmail(), reservation.getPhoneNumber(), reservation.getPatentNumber(), reservation.getPostCode(), reservation.getStreet(), reservation.getStreetNumber(), reservation.getCity()));

      _reservation.setYacht(yacht);
      _reservation.setClient(client);
      client.setReservation(_reservation);

      reservationRepository.save(_reservation);
      clientRepository.save(client);

      return new ResponseEntity<>(_reservation, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/addreservation")
  public ResponseEntity<?> addReservation(@Valid @RequestBody RAndCObjectForNew reservationData) {
    try {
      RWithYachtId reservation = reservationData.getReservation();
      Yacht yacht;
      if (yachtRepository.findById(reservation.getYachtId()).isPresent())
        yacht = yachtRepository.findById(reservation.getYachtId()).get();
      else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      CNoIds client = reservationData.getClient();

      Reservation _reservation = reservationRepository.save(new Reservation(reservation.getStartDate(), reservation.getEndDate(), reservation.getPrice(), reservation.getMessage(), yacht));
      Client _client = clientRepository.save(new Client(client.getFirstname(), client.getLastname(), client.getEmail(), client.getPhoneNumber(), client.getPatentNumber(), client.getPostCode(), client.getStreet(), client.getStreetNumber(), client.getCity()));

      _client.setReservation(_reservation);
      _reservation.setClient(_client);

      reservationRepository.save(_reservation);
      clientRepository.save(_client);

      return new ResponseEntity<>(null, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/reservations/{id}")
  public ResponseEntity<Reservation> updateReservation(@PathVariable("id") long id, @RequestBody RAndCObjectForEdit reqBody) {
    try {
      Reservation resFromDB;
      if (reservationRepository.findById(id).isPresent()) resFromDB = reservationRepository.findById(id).get();
      else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);

      Client cFromDB;
      if (clientRepository.findByResId(id).isPresent()) cFromDB = clientRepository.findByResId(id).get();
      else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);

      RNoIds reservation = reqBody.getReservation();
      CNoIds client = reqBody.getClient();

      Reservation _reservation = resFromDB;
      _reservation.setPrice(reservation.getPrice());
      _reservation.setMessage(reservation.getMessage());
      _reservation.setStartDate(reservation.getStartDate());
      _reservation.setEndDate(reservation.getEndDate());
      reservationRepository.save(_reservation);

      Client _client = cFromDB;
      _client.setFirstname(client.getFirstname());
      _client.setLastname(client.getLastname());
      _client.setEmail(client.getEmail());
      _client.setPhoneNumber(client.getPhoneNumber());
      _client.setPostCode(client.getPostCode());
      _client.setStreet(client.getStreet());
      _client.setStreetNumber(client.getStreetNumber());
      _client.setCity(client.getCity());
      clientRepository.save(_client);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/reservations/{id}")
  public ResponseEntity<HttpStatus> deleteReservation(@PathVariable("id") long resId) {
    try {
      clientRepository.nullifyResId(resId);
      clientRepository.deleteByResId(resId);
      reservationRepository.deleteById(resId);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/reservations")
  public ResponseEntity<HttpStatus> deleteAllReservations(@RequestParam() long yachtId) {
    try {
      clientRepository.nullifyResIdForAllCByYachtId(yachtId);
      reservationRepository.nullifyCdIdForAllResByYachtId(yachtId);
      clientRepository.deleteAllNullByYachtId();
      reservationRepository.deleteAllByYachtId(yachtId);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
