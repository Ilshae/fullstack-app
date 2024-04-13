package com.praca_inzynierska.backend.price.responseBody;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class PYachtId {
  private LocalDate date;
  private Double price;
  private Long yachtId;
}
