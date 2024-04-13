package com.praca_inzynierska.backend.reservation.responseBody;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class RDates {
  private LocalDate startDate;
  private LocalDate endDate;
}
