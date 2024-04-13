package com.praca_inzynierska.backend.price;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class PriceCalendar {
  private long yachtId;
  private LocalDate startDate;
  private LocalDate endDate;
}
