package com.praca_inzynierska.backend.price.responseBody;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class PNoIds {
  private LocalDate date;
  private Double price;
}
