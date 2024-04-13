package com.praca_inzynierska.backend.client;

import com.praca_inzynierska.backend.client.responseBody.CNoIds;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
  @Transactional
  @Modifying
  @Query(value = "DELETE FROM Client cd WHERE cd.reservation.id = :id")
  void deleteByResId(@Param("id") long id);

  @Transactional
  @Modifying
  @Query(value = "UPDATE Client cd SET cd.reservation.id = null WHERE cd.reservation.id = :id")
  void nullifyResId(@Param("id") long id);

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.client.responseBody.CNoIds(cd.firstname, cd.lastname, cd.email, cd.phoneNumber, cd.patentNumber, cd.postCode, cd.street, cd.streetNumber, cd.city) FROM Client cd WHERE cd.reservation.id = :id")
  CNoIds findClientByResId(@Param("id") Long id);

  @Query(value = "SELECT cd FROM Client cd WHERE cd.reservation.id = :id")
  Optional<Client> findByResId(@Param("id") Long id);

  @Transactional
  @Modifying
  @Query(value = "UPDATE Client cd SET cd.reservation.id = null WHERE cd.reservation.id IN (SELECT r.id FROM Reservation r WHERE r.yacht.id = :yachtId)")
  void nullifyResIdForAllCByYachtId(@Param("yachtId") long yachtId);

  @Transactional
  @Modifying
  @Query(value = "DELETE FROM Client cd WHERE cd.reservation.id = null")
  void deleteAllNullByYachtId();
}
