package com.praca_inzynierska.backend.auth.user.responseBody;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class URNoIds {
  private String username;
  private String email;
  private Set<String> roles;
}
