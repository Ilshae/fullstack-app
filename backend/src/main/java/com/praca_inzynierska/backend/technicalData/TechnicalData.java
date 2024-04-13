package com.praca_inzynierska.backend.technicalData;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.praca_inzynierska.backend.yacht.Yacht;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "technicalData")
public class TechnicalData {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @Column(name = "length")
  private double length;

  @Column(name = "width")
  private double width;

  @Column(name = "height")
  private double height;

  @Column(name = "engineType")
  @Enumerated(EnumType.STRING)
  private EngineType engineType;

  @Column(name = "engineManufacturer")
  private String engineManufacturer;

  @Column(name = "enginePower")
  private double enginePower;

  @Column(name = "depth")
  private String depth;

  @Column(name = "mass")
  private double mass;

  @Column(name = "bottomBalast")
  private double bottomBalast;

  @Column(name = "sailsSurface")
  private double sailsSurface;

  @Column(name = "keelType")
  @Enumerated(EnumType.STRING)
  private KeelType keelType;

  @Column(name = "keelWeight")
  private double keelWeight;

  @Column(name = "stereType")
  @Enumerated(EnumType.STRING)
  private StereType stereType;

  @JsonIgnore
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "yacht_id", referencedColumnName = "id")
  private Yacht yacht;

  public TechnicalData(double length, double width, double height, EngineType engineType, String engineManufacturer, double enginePower, String depth, double mass, double bottomBalast, double sailsSurface, KeelType keelType, double keelWeight, StereType stereType) {
    this.length = length;
    this.width = width;
    this.height = height;
    this.engineType = engineType;
    this.engineManufacturer = engineManufacturer;
    this.enginePower = enginePower;
    this.depth = depth;
    this.mass = mass;
    this.bottomBalast = bottomBalast;
    this.sailsSurface = sailsSurface;
    this.keelType = keelType;
    this.keelWeight = keelWeight;
    this.stereType = stereType;
  }

  public void setYacht(Yacht yacht) {
    this.yacht = yacht;
  }

  public enum EngineType {
    outboard, stationary
  }

  public enum KeelType {
    full, lifting
  }

  public enum StereType {
    finOnRansom, steeringWheel
  }
}