package com.praca_inzynierska.backend.yacht.ResponseBody;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class YNoIds {
  private String model;
  private String modelNumber;
  private String name;
  private int people;
  private int year;
  private String url;
}
