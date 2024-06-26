package com.praca_inzynierska.backend.technicalData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class TechnicalDataController {

  @Autowired
  TechnicalDataRepository technicalDataRepository;

  public TechnicalDataController(TechnicalDataRepository technicalDataRepository) {
    this.technicalDataRepository = technicalDataRepository;
  }

}
