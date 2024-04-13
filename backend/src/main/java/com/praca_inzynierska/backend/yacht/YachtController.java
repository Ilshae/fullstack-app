package com.praca_inzynierska.backend.yacht;

import com.praca_inzynierska.backend.yacht.ResponseBody.*;
import com.praca_inzynierska.backend.client.ClientRepository;
import com.praca_inzynierska.backend.equipment.Equipment;
import com.praca_inzynierska.backend.equipment.EquipmentRepository;
import com.praca_inzynierska.backend.equipment.responseBody.ENoIds;
import com.praca_inzynierska.backend.file.FileDBRepository;
import com.praca_inzynierska.backend.price.PriceRepository;
import com.praca_inzynierska.backend.reservation.ReservationRepository;
import com.praca_inzynierska.backend.technicalData.TechnicalData;
import com.praca_inzynierska.backend.technicalData.TechnicalDataRepository;
import com.praca_inzynierska.backend.technicalData.responseBody.TDNoIds;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class YachtController {
  final YachtRepository yachtRepository;
  final TechnicalDataRepository technicalDataRepository;
  final EquipmentRepository equipmentRepository;
  final FileDBRepository fileDBRepository;
  final ReservationRepository reservationRepository;
  final PriceRepository priceRepository;
  final ClientRepository clientRepository;

  public YachtController(YachtRepository yachtRepository, TechnicalDataRepository technicalDataRepository, EquipmentRepository equipmentRepository, FileDBRepository fileDBRepository, ReservationRepository reservationRepository, PriceRepository priceRepository, ClientRepository clientRepository) {
    this.yachtRepository = yachtRepository;
    this.technicalDataRepository = technicalDataRepository;
    this.equipmentRepository = equipmentRepository;
    this.fileDBRepository = fileDBRepository;
    this.reservationRepository = reservationRepository;
    this.priceRepository = priceRepository;
    this.clientRepository = clientRepository;
  }

  @GetMapping("/yachts")
  public ResponseEntity<?> getAllYachts() {
    try {
      return new ResponseEntity<>(yachtRepository.findYachts(), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/yacht")
  public ResponseEntity<?> getYachtByUrl(@RequestParam String url) {
    try {
      YWithIdNoUrl yacht = yachtRepository.findYachtDataByUrl(url);
      TDNoIds technicalData = yachtRepository.findTechnicalDataByUrl(url);
      ENoIds equipment = yachtRepository.findEquipmentByUrl(url);
      YandTDAndEObjectForNew data = new YandTDAndEObjectForNew(yacht, technicalData, equipment);
      return new ResponseEntity<>(data, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/yachtName")
  public ResponseEntity<?> getYachtName(@RequestParam Long id) {
    try {
      return new ResponseEntity<>(yachtRepository.findYachtName(id), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/models")
  public ResponseEntity<?> getModels() {
    try {
      return new ResponseEntity<>(yachtRepository.findModels(), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/yachts/{id}")
  public ResponseEntity<?> getYachtById(@PathVariable("id") Long yachtId) {
    try {
      YNoIds yacht = yachtRepository.findYachtById(yachtId);
      TDNoIds technicalData = yachtRepository.findTechnicalDataByUrl(yacht.getUrl());
      ENoIds equipment = yachtRepository.findEquipmentByUrl(yacht.getUrl());
      return new ResponseEntity<>(new YandTDAndEObjectForEdit(yacht, technicalData, equipment), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping("/yachtsFilter")
  public ResponseEntity<?> filterYachts(@RequestBody YModelDatesPrice yachtFilter) {
    try {
      String model = yachtFilter.getModel();
      LocalDate startDate = yachtFilter.getStartDate();
      LocalDate endDate = yachtFilter.getEndDate();
      Double maxPrice = yachtFilter.getMaxPrice();
      // model
      if (model != null && startDate == null && endDate == null && maxPrice == null)
        return new ResponseEntity<>(yachtRepository.findByModelContaining(model), HttpStatus.OK);
        // startDate
      else if (model == null && startDate != null && endDate == null && maxPrice == null)
        return new ResponseEntity<>(yachtRepository.findByStartDate(startDate), HttpStatus.OK);
        // startDate + endDate
      else if (model == null && startDate != null && endDate != null && maxPrice == null)
        return new ResponseEntity<>(yachtRepository.findByStartDateAndEndDate(startDate, endDate), HttpStatus.OK);
        // price
      else if (model == null && startDate == null && endDate == null && maxPrice != null)
        return new ResponseEntity<>(yachtRepository.findByMaxPrice(maxPrice), HttpStatus.OK);
        // combinations
      else if (model != null && startDate != null && endDate == null && maxPrice == null)
        return new ResponseEntity<>(yachtRepository.findByStartDateAndModel(model, startDate), HttpStatus.OK);
      else if (model != null && startDate != null && endDate != null && maxPrice == null)
        return new ResponseEntity<>(yachtRepository.findByStartDateAndEndDateAndModel(model, startDate, endDate), HttpStatus.OK);
      else if (model != null && startDate == null && endDate == null)
        return new ResponseEntity<>(yachtRepository.findByModelAndMaxPrice(model, maxPrice), HttpStatus.OK);
      else if (model == null && startDate != null && endDate == null)
        return new ResponseEntity<>(yachtRepository.findByStartDateAndMaxPrice(startDate, maxPrice), HttpStatus.OK);
      else if (model == null && startDate != null)
        return new ResponseEntity<>(yachtRepository.findByStartDateAndEndDateAndMaxPrice(startDate, endDate, maxPrice), HttpStatus.OK);
      else if (model != null && startDate != null && endDate == null)
        return new ResponseEntity<>(yachtRepository.findByModelAndStartDateAndMaxPrice(model, startDate, maxPrice), HttpStatus.OK);
      else if (model != null && startDate != null)
        return new ResponseEntity<>(yachtRepository.findByModelAndStartDateAndEndDateAndMaxPrice(model, startDate, endDate, maxPrice), HttpStatus.OK);
      // return all
      return new ResponseEntity<>(yachtRepository.findAllYachts(), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/yachts")
  public ResponseEntity<?> createYacht(@RequestBody YandTDAndEObjectForNew yachtData) {
    try {
      YWithIdNoUrl yacht = yachtData.getYacht();
      TDNoIds technicalData = yachtData.getTechnicalData();
      ENoIds equipment = yachtData.getEquipment();

      String url = yacht.constructUrl(yacht.getModel(), yacht.getModelNumber(), yacht.getName());
      boolean urlTaken = true;
      int counter = 0;
      while (urlTaken) {
        Optional<Yacht> existingYacht = yachtRepository.findByUrl(url);
        if (existingYacht.isEmpty()) urlTaken = false;
        else {
          counter = counter + 1;
          url = url + counter;
        }
      }
      Yacht yachtR = yachtRepository.save(new Yacht(yacht.getName(), yacht.getModel(), yacht.getModelNumber(), yacht.getPeople(), yacht.getYear(), url));
      TechnicalData yachtTD = technicalDataRepository.save(new TechnicalData(technicalData.getLength(), technicalData.getWidth(), technicalData.getHeight(), technicalData.getEngineType(), technicalData.getEngineManufacturer(), technicalData.getEnginePower(), technicalData.getDepth(), technicalData.getMass(), technicalData.getBottomBalast(), technicalData.getSailsSurface(), technicalData.getKeelType(), technicalData.getKeelWeight(), technicalData.getStereType()));
      Equipment yachtE = equipmentRepository.save(new Equipment(equipment.isSprayhood(), equipment.isTent(), equipment.isRailings(), equipment.isBowBasket(), equipment.isEmergencyMeasures(), equipment.isDrinkingWaterInstallation(), equipment.isLakeWaterInstallation(), equipment.isHotWater(), equipment.isFridge(), equipment.isHeating(), equipment.isTableware(), equipment.isCookingEquipment(), equipment.isRadio(), equipment.isMp3(), equipment.isSocket12v(), equipment.isInstallation220v(), equipment.isRectifier(), equipment.isEchosounder(), equipment.isTv(), equipment.getOther()));

      yachtR.setTechnicalData(yachtTD);
      yachtR.setEquipment(yachtE);

      yachtTD.setYacht(yachtR);
      yachtE.setYacht(yachtR);

      yachtRepository.save(yachtR);
      technicalDataRepository.save(yachtTD);
      equipmentRepository.save(yachtE);
      return new ResponseEntity<>(yachtR.getId(), HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/yachts/{id}")
  public ResponseEntity<Yacht> updateYacht(@PathVariable("id") long yachtId, @RequestBody YandTDAndEObjectForEdit yachtData) {
    try {
      YNoIds yacht = yachtData.getYacht();
      TDNoIds td = yachtData.getTechnicalData();
      ENoIds eq = yachtData.getEquipment();

      Yacht yachtFromDB;
      if (yachtRepository.findById(yachtId).isPresent()) yachtFromDB = yachtRepository.findById(yachtId).get();
      else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);

      TechnicalData tdFromDB;
      if (technicalDataRepository.findById(yachtFromDB.getTechnicalData().getId()).isPresent())
        tdFromDB = technicalDataRepository.findById(yachtFromDB.getTechnicalData().getId()).get();
      else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);

      Equipment eqFromDB;
      if (equipmentRepository.findById(yachtFromDB.getEquipment().getId()).isPresent())
        eqFromDB = equipmentRepository.findById(yachtFromDB.getEquipment().getId()).get();
      else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);

      yachtFromDB.setModel(yacht.getModel());
      yachtFromDB.setModelNumber(yacht.getModelNumber());
      yachtFromDB.setName(yacht.getName());
      yachtFromDB.setPeople(yacht.getPeople());
      yachtFromDB.setYear(yacht.getYear());
      yachtFromDB.setUrl(yacht.getUrl());
      yachtRepository.save(yachtFromDB);

      tdFromDB.setLength(td.getLength());
      tdFromDB.setWidth(td.getWidth());
      tdFromDB.setHeight(td.getHeight());
      tdFromDB.setEngineType(td.getEngineType());
      tdFromDB.setEngineManufacturer(td.getEngineManufacturer());
      tdFromDB.setEnginePower(td.getEnginePower());
      tdFromDB.setDepth(td.getDepth());
      tdFromDB.setMass(td.getMass());
      tdFromDB.setBottomBalast(td.getBottomBalast());
      tdFromDB.setSailsSurface(td.getSailsSurface());
      tdFromDB.setKeelType(td.getKeelType());
      tdFromDB.setKeelWeight(td.getKeelWeight());
      tdFromDB.setStereType(td.getStereType());
      technicalDataRepository.save(tdFromDB);

      eqFromDB.setBowBasket(eq.isBowBasket());
      eqFromDB.setCookingEquipment(eq.isCookingEquipment());
      eqFromDB.setDrinkingWaterInstallation(eq.isDrinkingWaterInstallation());
      eqFromDB.setEchosounder(eq.isEchosounder());
      eqFromDB.setEmergencyMeasures(eq.isEmergencyMeasures());
      eqFromDB.setFridge(eq.isFridge());
      eqFromDB.setHeating(eq.isHeating());
      eqFromDB.setHotWater(eq.isHotWater());
      eqFromDB.setInstallation220v(eq.isInstallation220v());
      eqFromDB.setLakeWaterInstallation(eq.isLakeWaterInstallation());
      eqFromDB.setMp3(eq.isMp3());
      eqFromDB.setRadio(eq.isRadio());
      eqFromDB.setRailings(eq.isRailings());
      eqFromDB.setRectifier(eq.isRectifier());
      eqFromDB.setSocket12v(eq.isSocket12v());
      eqFromDB.setSprayhood(eq.isSprayhood());
      eqFromDB.setTableware(eq.isTableware());
      eqFromDB.setTent(eq.isTent());
      eqFromDB.setTv(eq.isTv());
      eqFromDB.setOther(eq.getOther());
      equipmentRepository.save(eqFromDB);

      return new ResponseEntity<>(null, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/yachts/{id}")
  public ResponseEntity<HttpStatus> deleteYacht(@PathVariable("id") long yachtId) {
    try {
      fileDBRepository.deleteByYachtId(yachtId);
      priceRepository.deleteByYachtId(yachtId);
      List<Long> resIds = reservationRepository.findResIdByYachtId(yachtId);
      for (Long resId : resIds) {
        clientRepository.nullifyResId(resId);
        clientRepository.deleteByResId(resId);
      }
      reservationRepository.deleteByYachtId(yachtId);
      yachtRepository.deleteById(yachtId);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/yachts")
  public ResponseEntity<HttpStatus> deleteAllYachts() {
    try {
      yachtRepository.deleteAll();
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
