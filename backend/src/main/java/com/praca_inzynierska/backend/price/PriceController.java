package com.praca_inzynierska.backend.price;

import com.praca_inzynierska.backend.auth.user.responseBody.MessageResponse;
import com.praca_inzynierska.backend.price.responseBody.PNoIds;
import com.praca_inzynierska.backend.price.responseBody.PYachtId;
import com.praca_inzynierska.backend.yacht.Yacht;
import com.praca_inzynierska.backend.yacht.YachtRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class PriceController {
  final PriceRepository priceRepository;
  final YachtRepository yachtRepository;

  public PriceController(PriceRepository priceRepository, YachtRepository yachtRepository) {
    this.priceRepository = priceRepository;
    this.yachtRepository = yachtRepository;
  }

  @GetMapping("/prices")
  public ResponseEntity<?> getPricesByYachtId(@RequestParam() long yachtId) {
    try {
      return new ResponseEntity<>(priceRepository.findByYachtId(yachtId), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/prices/yachtName")
  public ResponseEntity<?> getYachtNameByPriceId(@RequestParam() long id) {
    try {
      return new ResponseEntity<>(yachtRepository.findYachtNameByPriceId(id), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/prices/{id}")
  public ResponseEntity<?> getPriceById(@PathVariable("id") long id) {
    try {
      return new ResponseEntity<>(priceRepository.findPriceForAdminPanelEdit(id), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/charterPrice")
  public ResponseEntity<Double> getCharterPrice(@RequestBody PriceCalendar priceCalendar) {
    try {
      double sumPrice = 0L;
      Optional<Price> price;
      for (LocalDate date = priceCalendar.getStartDate(); !date.isAfter(priceCalendar.getEndDate()); date = date.plusDays(1)) {
        price = Optional.ofNullable(priceRepository.findByYachtIdAndDate(priceCalendar.getYachtId(), date));
        if (price.isEmpty()) {
          sumPrice = 0;
          break;
        }
        sumPrice = sumPrice + price.get().getPrice();
      }
      return new ResponseEntity<>(sumPrice, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/prices")
  public ResponseEntity<?> createPrice(@RequestBody PYachtId priceData) {
    try {
      Yacht _yacht;
      if (yachtRepository.findById(priceData.getYachtId()).isPresent())
        _yacht = yachtRepository.findById(priceData.getYachtId()).get();
      else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      if (priceRepository.existsByDateAndYachtId(priceData.getDate(), priceData.getYachtId()) > 0) return ResponseEntity
        .badRequest()
        .body(new MessageResponse("Error: Price for this date and yacht is already created!"));
      Price _price = priceRepository.save(new Price(priceData.getDate(), priceData.getPrice(), _yacht));
      priceRepository.save(_price);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/prices/{id}")
  public ResponseEntity<?> updatePrice(@PathVariable("id") long id, @RequestBody PNoIds price) {
    try {
      Optional<Price> priceFromDB = priceRepository.findById(id);
      if (priceFromDB.isPresent()) {
        if (!Objects.equals(priceFromDB.get().getDate(), price.getDate()) && priceRepository.existsByDateAndYachtId(price.getDate(), priceFromDB.get().getYacht().getId()) > 0) {
          return ResponseEntity
            .badRequest()
            .body(new MessageResponse("Error: You can't create two prices for the same date"));
        } else {
          Price _price = priceFromDB.get();
          _price.setDate(price.getDate());
          _price.setPrice(price.getPrice());
          priceRepository.save(_price);
          return new ResponseEntity<>(null, HttpStatus.OK);
        }
      } else {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/prices/{id}")
  public ResponseEntity<HttpStatus> deletePrice(@PathVariable("id") long id) {
    try {
      priceRepository.nullifyYachtId(id);
      priceRepository.deleteById(id);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/prices")
  public ResponseEntity<HttpStatus> deleteAllPrices(@RequestParam() long yachtId) {
    try {
      priceRepository.nullifyYachtIdForAllPrices(yachtId);
      priceRepository.deleteAllPricesByYachtId(yachtId);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
