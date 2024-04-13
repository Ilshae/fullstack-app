package com.praca_inzynierska.backend.yacht;

import com.praca_inzynierska.backend.equipment.responseBody.ENoIds;
import com.praca_inzynierska.backend.technicalData.responseBody.TDNoIds;
import com.praca_inzynierska.backend.yacht.ResponseBody.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface YachtRepository extends JpaRepository<Yacht, Long> {
  List<Yacht> findByModelContaining(String model);
  Optional<Yacht> findByUrl(String url);

  @Query(value = "SELECT DISTINCT y.model FROM Yacht y ORDER BY y.model")
  List<String> findModels();

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YNoIds(y.model, y.modelNumber, y.name, y.people, y.year, y.url) FROM Yacht y WHERE y.id = :id")
  YNoIds findYachtById(@Param("id") Long id);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithId(y.id, y.model, y.modelNumber, y.name, y.people, y.year,y.url) FROM Yacht y")
  List<YWithId> findYachts();

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNoUrl(y.id, y.model, y.modelNumber, y.name, y.people, y.year) FROM Yacht y WHERE y.url = :url")
  YWithIdNoUrl findYachtDataByUrl(@Param("url") String url);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.technicalData.responseBody.TDNoIds(td.bottomBalast, td.depth, td.engineManufacturer, td.enginePower, td.engineType, td.height, td.keelType, td.keelWeight, td.length, td.mass, td.sailsSurface, td.stereType, td.width) FROM Yacht y LEFT JOIN TechnicalData td ON y.id = td.yacht.id WHERE y.url = :url")
  TDNoIds findTechnicalDataByUrl(@Param("url") String url);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.equipment.responseBody.ENoIds(e.bowBasket, e.cookingEquipment, e.drinkingWaterInstallation, e.echosounder, e.emergencyMeasures, e.fridge, e.heating, e.hotWater, e.installation220v, e.lakeWaterInstallation, e.mp3, e.radio, e.railings, e.rectifier, e.socket12v, e.sprayhood, e.tableware, e.tent, e.tv, e.other) FROM Yacht y LEFT JOIN Equipment e ON y.id = e.yacht.id WHERE y.url = :url")
  ENoIds findEquipmentByUrl(@Param("url") String url);


  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNotAllArgs(y.id, y.model, y.modelNumber, y.name, y.url) FROM Yacht y ORDER BY y.model")
  List<YWithIdNotAllArgs> findAllYachts();

  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNotAllArgs(y.id, y.model, y.modelNumber, y.name, y.url) FROM Yacht y LEFT JOIN Reservation r ON y.id = r.yacht.id WHERE r.yacht.id NOT IN (SELECT r.yacht.id FROM Reservation r WHERE :startDate BETWEEN r.startDate AND r.endDate) OR r.startDate IS NULL ORDER BY y.model")
  List<YWithIdNotAllArgs> findByStartDate(@Param("startDate") LocalDate startDate);

  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNotAllArgs(y.id, y.model, y.modelNumber, y.name, y.url) FROM Yacht y LEFT JOIN Reservation r ON y.id = r.yacht.id WHERE (r.yacht.id NOT IN (SELECT r.yacht.id FROM Reservation r WHERE :startDate BETWEEN r.startDate AND r.endDate) OR r.startDate IS NULL) AND y.model = :model ORDER BY y.name")
  List<YWithIdNotAllArgs> findByStartDateAndModel(@Param("model") String model, @Param("startDate") LocalDate startDate);

  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNotAllArgs(y.id, y.model, y.modelNumber, y.name, y.url) FROM Yacht y LEFT JOIN Reservation r ON y.id = r.yacht.id WHERE r.yacht.id NOT IN (SELECT r.yacht.id FROM Reservation r WHERE r.endDate <= :endDate AND r.endDate >= :startDate OR r.startDate <= :endDate AND r.startDate >= :startDate OR r.startDate <= :startDate AND r.endDate >= :endDate) OR r.startDate IS NULL ORDER BY y.model")
  List<YWithIdNotAllArgs> findByStartDateAndEndDate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNotAllArgs(y.id, y.model, y.modelNumber, y.name, y.url) FROM Yacht y LEFT JOIN Reservation r ON y.id = r.yacht.id WHERE (r.yacht.id NOT IN (SELECT r.yacht.id FROM Reservation r WHERE r.endDate <= :endDate AND r.endDate >= :startDate OR r.startDate <= :endDate AND r.startDate >= :startDate OR r.startDate <= :startDate AND r.endDate >= :endDate) OR r.startDate IS NULL) AND y.model = :model ORDER BY y.name")
  List<YWithIdNotAllArgs> findByStartDateAndEndDateAndModel(@Param("model") String model, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNotAllArgs(y.id, y.model, y.modelNumber, y.name, y.url) FROM Yacht y LEFT JOIN Price p ON y.id = p.yacht.id WHERE p.price <= :maxPrice ORDER BY y.model")
  List<YWithIdNotAllArgs> findByMaxPrice(@Param("maxPrice") Double maxPrice);

  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNotAllArgs(y.id, y.model, y.modelNumber, y.name, y.url) FROM Yacht y LEFT JOIN Price p ON y.id = p.yacht.id WHERE p.price <= :maxPrice AND y.model = :model ORDER BY y.name")
  List<YWithIdNotAllArgs> findByModelAndMaxPrice(@Param("model") String model, @Param("maxPrice") Double maxPrice);

  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNotAllArgs(y.id, y.model, y.modelNumber, y.name, y.url) FROM Yacht y LEFT JOIN Reservation r ON y.id = r.yacht.id LEFT JOIN Price p ON y.id = p.yacht.id WHERE (r.yacht.id NOT IN (SELECT r.yacht.id FROM Reservation r WHERE :startDate BETWEEN r.startDate AND r.endDate) OR r.startDate IS NULL) AND p.price <= :maxPrice ORDER BY y.model")
  List<YWithIdNotAllArgs> findByStartDateAndMaxPrice(@Param("startDate") LocalDate startDate, @Param("maxPrice") Double maxPrice);

  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNotAllArgs(y.id, y.model, y.modelNumber, y.name, y.url) FROM Yacht y LEFT JOIN Reservation r ON y.id = r.yacht.id LEFT JOIN Price p ON y.id = p.yacht.id WHERE (r.yacht.id NOT IN (SELECT r.yacht.id FROM Reservation r WHERE r.endDate <= :endDate AND r.endDate >= :startDate OR r.startDate <= :endDate AND r.startDate >= :startDate OR r.startDate <= :startDate AND r.endDate >= :endDate) OR r.startDate IS NULL) AND p.price <= :maxPrice ORDER BY y.model")
  List<YWithIdNotAllArgs> findByStartDateAndEndDateAndMaxPrice(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("maxPrice") Double maxPrice);

  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNotAllArgs(y.id, y.model, y.modelNumber, y.name, y.url) FROM Yacht y LEFT JOIN Reservation r ON y.id = r.yacht.id LEFT JOIN Price p ON y.id = p.yacht.id WHERE (r.yacht.id NOT IN (SELECT r.yacht.id FROM Reservation r WHERE :startDate BETWEEN r.startDate AND r.endDate) OR r.startDate IS NULL) AND y.model = :model AND p.price <= :maxPrice ORDER BY y.name")
  List<YWithIdNotAllArgs> findByModelAndStartDateAndMaxPrice(@Param("model") String string, @Param("startDate") LocalDate startDate, @Param("maxPrice") Double maxPrice);

  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YWithIdNotAllArgs(y.id, y.model, y.modelNumber, y.name, y.url) FROM Yacht y LEFT JOIN Reservation r ON y.id = r.yacht.id LEFT JOIN Price p ON y.id = p.yacht.id WHERE (r.yacht.id NOT IN (SELECT r.yacht.id FROM Reservation r WHERE r.endDate <= :endDate AND r.endDate >= :startDate OR r.startDate <= :endDate AND r.startDate >= :startDate OR r.startDate <= :startDate AND r.endDate >= :endDate) OR r.startDate IS NULL) AND y.model = :model AND p.price <= :maxPrice ORDER BY y.name")
  List<YWithIdNotAllArgs> findByModelAndStartDateAndEndDateAndMaxPrice(@Param("model") String string, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("maxPrice") Double maxPrice);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YName(y.id, y.model, y.modelNumber, y.name) FROM Yacht y WHERE y.id = :id")
  YName findYachtName(@Param("id") Long id);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YName(y.id, y.model, y.modelNumber, y.name) FROM Yacht y LEFT JOIN Reservation r ON y.id = r.yacht.id WHERE r.id = :id")
  YName findYachtNameByReservationId(@Param("id") Long id);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.yacht.ResponseBody.YName(y.id, y.model, y.modelNumber, y.name) FROM Yacht y LEFT JOIN Price p ON y.id = p.yacht.id WHERE p.id = :id")
  YName findYachtNameByPriceId(@Param("id") Long id);
}
