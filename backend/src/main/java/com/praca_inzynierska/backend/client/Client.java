package com.praca_inzynierska.backend.client;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.praca_inzynierska.backend.reservation.Reservation;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "clients")
public class Client {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @NotEmpty(message = "Name is mandatory")
  @Size(min = 1, max = 150)
  @Column(name = "firstname")
  private String firstname;

  @NotEmpty(message = "lastname is mandatory")
  @Size(min = 1, max = 150)
  @Column(name = "lastname")
  private String lastname;

  @NotEmpty(message = "Email is mandatory")
  @Size(min = 1, max = 150)
  @Email
  @Column(name = "email")
  private String email;

  @NotEmpty(message = "Phone number is mandatory")
  @Size(min = 1, max = 20)
  @Column(name = "phoneNumber")
  private String phoneNumber;

  @NotEmpty(message = "Patent number is mandatory")
  @Size(min = 1, max = 20)
  @Column(name = "patentNumber")
  private String patentNumber;

  @NotEmpty(message = "Post code is mandatory")
  @Size(min = 1, max = 8)
  @Column(name = "postCode")
  private String postCode;

  @NotEmpty(message = "Street is mandatory")
  @Size(min = 1, max = 150)
  @Column(name = "street")
  private String street;

  @NotEmpty(message = "Street number is mandatory")
  @Size(min = 1, max = 8)
  @Column(name = "streetNumber")
  private String streetNumber;

  @NotEmpty(message = "City is mandatory")
  @Size(min = 1, max = 150)
  @Column(name = "city")
  private String city;

  @JsonIgnore
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "reservation_id", referencedColumnName = "id")
  private Reservation reservation;

  public Client(String firstname, String lastname, String email, String phoneNumber, String patentNumber, String postCode, String street, String streetNumber, String city) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.patentNumber = patentNumber;
    this.postCode = postCode;
    this.street = street;
    this.streetNumber = streetNumber;
    this.city = city;
  }

}
