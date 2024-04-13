package com.praca_inzynierska.backend.reservation;

import com.praca_inzynierska.backend.reservation.responseBody.RDates;
import com.praca_inzynierska.backend.reservation.responseBody.RNoForeignIds;
import com.praca_inzynierska.backend.reservation.responseBody.RNoIds;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
  @Transactional
  @Modifying
  @Query(value = "DELETE FROM Reservation r WHERE r.id = :id")
  void deleteById(@Param("id") long id);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.reservation.responseBody.RNoForeignIds(r.id, r.startDate, r.endDate, r.price, r.message, cd.firstname, cd.lastname) FROM Reservation r LEFT JOIN Client cd ON r.id = cd.reservation.id WHERE r.yacht.id = :id")
  List<RNoForeignIds> findByYachtId(@Param("id") Long id);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.reservation.responseBody.RDates(r.startDate, r.endDate) FROM Reservation r LEFT JOIN Client cd ON r.id = cd.reservation.id WHERE r.yacht.id = :id")
  List<RDates> findDisabledDatesByYachtId(@Param("id") Long id);

  @Query(value = "SELECT r.id FROM Reservation r WHERE r.yacht.id = :id")
  List<Long> findResIdByYachtId(@Param("id") Long id);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.reservation.responseBody.RNoIds(r.startDate, r.endDate, r.price, r.message) FROM Reservation r WHERE r.id = :id")
  RNoIds findResForAdminPanelEdit(@Param("id") Long id);

  @Transactional
  @Modifying
  @Query(value = "UPDATE Reservation r SET r.client.id = null WHERE r.yacht.id = :yachtId")
  void nullifyCdIdForAllResByYachtId(@Param("yachtId") long yachtId);

  @Transactional
  @Modifying
  @Query(value = "DELETE FROM Reservation r WHERE r.yacht.id = :id")
  void deleteByYachtId(@Param("id") long id);

  @Transactional
  @Modifying
  @Query(value = "DELETE FROM Reservation r WHERE r.yacht.id = :yachtId")
  void deleteAllByYachtId(@Param("yachtId") long yachtId);

  @Query(value = "SELECT count(r.id) FROM Reservation r WHERE r.startDate <= :date AND r.endDate >= :date AND r.yacht.id = :yachtId")
  Long findIfReserved(@Param("date") LocalDate date, @Param("yachtId") long yachtId);
}
