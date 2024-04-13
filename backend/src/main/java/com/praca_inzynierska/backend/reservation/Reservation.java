package com.praca_inzynierska.backend.reservation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.praca_inzynierska.backend.client.Client;
import com.praca_inzynierska.backend.yacht.Yacht;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "reservations")
public class Reservation {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @NotNull(message = "Start date is mandatory")
  @DateTimeFormat(pattern = "yyyy-MM-dd")
  @Column(name = "startDate")
  private LocalDate startDate;

  @NotNull(message = "End date is mandatory")
  @DateTimeFormat(pattern = "yyyy-MM-dd")
  @Column(name = "endDate")
  private LocalDate endDate;

  @NotNull(message = "Price is mandatory")
  @Column(name = "price")
  private Double price;

  @Column(name = "message")
  @Size(max = 512)
  private String message;

  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "yacht_id", referencedColumnName = "id")
  private Yacht yacht;

  @JsonIgnore
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "clientId", referencedColumnName = "id")
  private Client client;

  public Reservation(LocalDate startDate, LocalDate endDate, Double price, String message) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.price = price;
    this.message = message;
  }

  public Reservation(LocalDate startDate, LocalDate endDate, Double price, String message, Yacht yacht) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.price = price;
    this.message = message;
    this.yacht = yacht;
  }
}
