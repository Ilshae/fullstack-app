package com.praca_inzynierska.backend.reservation.responseBody;

import com.praca_inzynierska.backend.client.responseBody.CNoIds;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RAndCObjectForEdit {
  private RNoIds reservation;
  private CNoIds client;
}
