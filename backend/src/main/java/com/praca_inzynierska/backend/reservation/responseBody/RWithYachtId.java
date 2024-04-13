package com.praca_inzynierska.backend.reservation.responseBody;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
@Getter
@AllArgsConstructor
public class RWithYachtId {
  private Long yachtId;
  private LocalDate startDate;
  private LocalDate endDate;
  private Double price;
  private String message;
}
