package com.praca_inzynierska.backend.file;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface FileDBRepository extends JpaRepository<FileDB, Long> {
  List<FileDB> findByYachtId(long yachtId);

  @Transactional
  @Modifying
  @Query(value = "DELETE FROM FileDB files WHERE files.yacht.id = :id")
  void deleteByYachtId(@Param("id") long id);

  @Transactional
  @Modifying
  @Query(value = "DELETE FROM FileDB files WHERE files.id = :id")
  void deleteById(@Param("id") long id);

}
