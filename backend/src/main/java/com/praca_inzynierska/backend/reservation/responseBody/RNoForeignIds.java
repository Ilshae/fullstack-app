package com.praca_inzynierska.backend.reservation.responseBody;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class RNoForeignIds {
  private Long id;
  private LocalDate startDate;
  private LocalDate endDate;
  private Double price;
  private String message;
  private String firstname;
  private String lastname;
}
