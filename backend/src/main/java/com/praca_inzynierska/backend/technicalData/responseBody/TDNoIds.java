package com.praca_inzynierska.backend.technicalData.responseBody;

import com.praca_inzynierska.backend.technicalData.TechnicalData;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TDNoIds {
  private double bottomBalast;
  private String depth;
  private String engineManufacturer;
  private double enginePower;
  private TechnicalData.EngineType engineType;
  private double height;
  private TechnicalData.KeelType keelType;
  private double keelWeight;
  private double length;
  private double mass;
  private double sailsSurface;
  private TechnicalData.StereType stereType;
  private double width;
}
