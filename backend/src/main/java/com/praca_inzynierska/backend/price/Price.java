package com.praca_inzynierska.backend.price;

import com.praca_inzynierska.backend.yacht.Yacht;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "prices")
public class Price {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @Column(name = "date")
  private LocalDate date;

  @Column(name = "price")
  private Double price;

  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "yacht_id", referencedColumnName = "id")
  private Yacht yacht;

  public Price(LocalDate date, Double price, Yacht yacht) {
    this.date = date;
    this.price = price;
    this.yacht = yacht;
  }
}
