package com.praca_inzynierska.backend.auth.user;

import com.praca_inzynierska.backend.auth.user.responseBody.UNoIds;
import com.praca_inzynierska.backend.auth.user.responseBody.UsersAndTheirRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  @Query(value = "SELECT DISTINCT NEW com.praca_inzynierska.backend.auth.user.responseBody.UsersAndTheirRoles(u.id, u.username, u.email, r.name) from User u INNER JOIN u.roles r ORDER BY u.id")
  List<UsersAndTheirRoles> getUsers();

  @Query(value = "SELECT NEW com.praca_inzynierska.backend.auth.user.responseBody.UNoIds(u.username, u.email) FROM User u WHERE u.id = :id")
  UNoIds findUserById(@Param("id") Long id);
}
