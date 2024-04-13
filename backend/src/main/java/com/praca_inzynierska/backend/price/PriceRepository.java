package com.praca_inzynierska.backend.price;

import com.praca_inzynierska.backend.price.responseBody.PNoForeignIds;
import com.praca_inzynierska.backend.price.responseBody.PNoIds;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;

public interface PriceRepository extends JpaRepository<Price, Long> {
  @Query(value = "SELECT p FROM Price p WHERE p.yacht.id = :yachtId and p.date = :date")
  Price findByYachtIdAndDate(@Param("yachtId") long yachtId, @Param("date") LocalDate date);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.price.responseBody.PNoForeignIds(p.id, p.date, p.price) FROM Price p WHERE p.yacht.id = :id")
  List<PNoForeignIds> findByYachtId(@Param("id") Long id);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.price.responseBody.PNoIds(p.date, p.price) FROM Price p WHERE p.id = :id")
  PNoIds findPriceForAdminPanelEdit(@Param("id") Long id);

  @Transactional
  @Modifying
  @Query(value = "UPDATE Price p SET p.yacht.id = null WHERE p.id = :id")
  void nullifyYachtId(@Param("id") long id);

  @Transactional
  @Modifying
  @Query(value = "DELETE FROM Price p WHERE p.yacht.id = :id")
  void deleteByYachtId(@Param("id") long id);

  @Transactional
  @Modifying
  @Query(value = "UPDATE Price p SET p.yacht.id = null WHERE p.id = :yachtId")
  void nullifyYachtIdForAllPrices(@Param("yachtId") long yachtId);

  @Transactional
  @Modifying
  @Query(value = "DELETE FROM Price p WHERE p.yacht.id = :yachtId")
  void deleteAllPricesByYachtId(@Param("yachtId") long yachtId);

  @Query(value = "SELECT COUNT(p) FROM Price p where p.date = :date AND p.yacht.id = :yachtId")
  Long existsByDateAndYachtId(@Param("date") LocalDate date, @Param("yachtId") Long yachtId);
}
