package com.praca_inzynierska.backend.equipment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.praca_inzynierska.backend.yacht.Yacht;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "equipment")
public class Equipment {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @Column(name = "sprayhood")
  private boolean sprayhood;

  @Column(name = "tent")
  private boolean tent;

  @Column(name = "railings")
  private boolean railings;

  @Column(name = "bowBasket")
  private boolean bowBasket;

  @Column(name = "emergencyMeasures")
  private boolean emergencyMeasures;

  @Column(name = "drinkingWaterInstallation")
  private boolean drinkingWaterInstallation;

  @Column(name = "lakeWaterInstallation")
  private boolean lakeWaterInstallation;

  @Column(name = "hotWater")
  private boolean hotWater;

  @Column(name = "fridge")
  private boolean fridge;

  @Column(name = "heating")
  private boolean heating;

  @Column(name = "tableware")
  private boolean tableware;

  @Column(name = "cookingEquipment")
  private boolean cookingEquipment;

  @Column(name = "radio")
  private boolean radio;

  @Column(name = "mp3")
  private boolean mp3;

  @Column(name = "socket12v")
  private boolean socket12v;

  @Column(name = "installation220v")
  private boolean installation220v;

  @Column(name = "rectifier")
  private boolean rectifier;

  @Column(name = "echosounder")
  private boolean echosounder;

  @Column(name = "tv")
  private boolean tv;

  @Column(name = "other")
  @Size(max = 512)
  private String other;

  @JsonIgnore
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "yacht_id", referencedColumnName = "id")
  private Yacht yacht;

  public Equipment(boolean sprayhood, boolean tent, boolean railings, boolean bowBasket, boolean emergencyMeasures, boolean drinkingWaterInstallation, boolean lakeWaterInstallation, boolean hotWater, boolean fridge, boolean heating, boolean tableware, boolean cookingEquipment, boolean radio, boolean mp3, boolean socket12v, boolean installation220v, boolean rectifier, boolean echosounder, boolean tv, String other) {
    this.sprayhood = sprayhood;
    this.tent = tent;
    this.railings = railings;
    this.bowBasket = bowBasket;
    this.emergencyMeasures = emergencyMeasures;
    this.drinkingWaterInstallation = drinkingWaterInstallation;
    this.lakeWaterInstallation = lakeWaterInstallation;
    this.hotWater = hotWater;
    this.fridge = fridge;
    this.heating = heating;
    this.tableware = tableware;
    this.cookingEquipment = cookingEquipment;
    this.radio = radio;
    this.mp3 = mp3;
    this.socket12v = socket12v;
    this.installation220v = installation220v;
    this.rectifier = rectifier;
    this.echosounder = echosounder;
    this.tv = tv;
    this.other = other;
  }
}