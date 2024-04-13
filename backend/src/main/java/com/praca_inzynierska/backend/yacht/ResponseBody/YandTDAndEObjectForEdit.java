package com.praca_inzynierska.backend.yacht.ResponseBody;

import com.praca_inzynierska.backend.equipment.responseBody.ENoIds;
import com.praca_inzynierska.backend.technicalData.responseBody.TDNoIds;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class YandTDAndEObjectForEdit {
  private YNoIds yacht;
  private TDNoIds technicalData;
  private ENoIds equipment;
}
