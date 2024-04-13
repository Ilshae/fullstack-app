package com.praca_inzynierska.backend.yacht.ResponseBody;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.text.Normalizer;

@AllArgsConstructor
@Getter
public class YWithIdNoUrl {
  private Long id;
  private String model;
  private String modelNumber;
  private String name;
  private int people;
  private int year;


  public String normalize(String string) {
    string = Normalizer.normalize(string, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "");
    string = string.replace(" ", "").replace(".", "").replace("-", "").toLowerCase();
    return string;
  }

  public String constructUrl(String model, String modelNumber, String name) {
    model = normalize(model);
    modelNumber = normalize(modelNumber);
    name = normalize(name);
    return model + "-" + modelNumber + "-" + name;
  }
}