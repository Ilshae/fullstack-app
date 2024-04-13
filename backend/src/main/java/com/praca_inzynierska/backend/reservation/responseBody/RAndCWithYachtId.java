package com.praca_inzynierska.backend.reservation.responseBody;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class RAndCWithYachtId {
  private LocalDate startDate;
  private LocalDate endDate;
  private String firstname;
  private String lastname;
  private String email;
  private String phoneNumber;
  private String patentNumber;
  private String postCode;
  private String street;
  private String streetNumber;
  private String city;
  private String message;
  private Long yachtId;
}
