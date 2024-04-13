package com.praca_inzynierska.backend.auth.role;

import com.praca_inzynierska.backend.auth.role.Role.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(ERole name);

  @Query(value = "SELECT r.name FROM User u INNER JOIN u.roles r WHERE u.id = :id")
  Set<String> findRoleByUserId(@Param("id") Long id);
}
