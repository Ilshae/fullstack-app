package com.praca_inzynierska.backend.file;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseMessage {
  private String message;

  public ResponseMessage(String message) {
    this.message = message;
  }
}
