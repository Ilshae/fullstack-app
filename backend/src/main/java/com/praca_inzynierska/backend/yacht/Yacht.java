package com.praca_inzynierska.backend.yacht;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.praca_inzynierska.backend.equipment.Equipment;
import com.praca_inzynierska.backend.file.FileDB;
import com.praca_inzynierska.backend.price.Price;
import com.praca_inzynierska.backend.reservation.Reservation;
import com.praca_inzynierska.backend.technicalData.TechnicalData;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "yachts")
public class Yacht {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @Column(name = "name")
  private String name;

  @Column(name = "model")
  private String model;

  @Column(name = "modelNumber")
  private String modelNumber;

  @Column(name = "year")
  private int year;

  @Column(name = "people")
  private int people;

  @Column(name = "url")
  private String url;

  @JsonIgnore
  @OneToMany(mappedBy = "yacht")
  private Set<Reservation> reservations;

  @JsonIgnore
  @OneToMany(mappedBy = "yacht")
  private Set<Price> prices;

  @JsonIgnore
  @OneToMany(mappedBy = "yacht")
  private Set<FileDB> fileDB;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "technicalDataId", referencedColumnName = "id")
  private TechnicalData technicalData;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "equipmentId", referencedColumnName = "id")
  private Equipment equipment;

  public Yacht(String name, String model, String modelNumber, int year, int people, String url) {
    this.name = name;
    this.model = model;
    this.modelNumber = modelNumber;
    this.year = year;
    this.people = people;
    this.url = url;
  }
}
