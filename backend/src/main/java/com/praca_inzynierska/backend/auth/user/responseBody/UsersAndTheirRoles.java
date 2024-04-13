package com.praca_inzynierska.backend.auth.user.responseBody;

import com.praca_inzynierska.backend.auth.role.Role.ERole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UsersAndTheirRoles {
  private Long id;
  private String username;
  private String email;
  private ERole roles;
}
