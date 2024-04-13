package com.praca_inzynierska.backend.yacht.ResponseBody;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class YModelDatesPrice {
  private String model;
  private LocalDate startDate;
  private LocalDate endDate;
  private Double maxPrice;
}
