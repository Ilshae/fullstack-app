package com.praca_inzynierska.backend.yacht.ResponseBody;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class YName {
  private Long id;
  private String model;
  private String modelNumber;
  private String name;
}
