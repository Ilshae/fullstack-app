package com.praca_inzynierska.backend.reservation.responseBody;

import com.praca_inzynierska.backend.client.responseBody.CNoIds;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RAndCObjectForNew {
  private RWithYachtId reservation;
  private CNoIds client;
}
