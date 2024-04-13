package com.praca_inzynierska.backend.file;

import com.praca_inzynierska.backend.yacht.Yacht;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "gallery")
public class FileDB {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @Column
  private String name;

  @Column
  private String fileType;

  @Column
  @Lob
  private byte[] data;

  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "yacht_id", referencedColumnName = "id")
  private Yacht yacht;

  public FileDB(String name, String fileType, byte[] data) {
    this.name = name;
    this.fileType = fileType;
    this.data = data;
  }

  public FileDB(String name, String fileType, byte[] data, Yacht yacht) {
    this.name = name;
    this.fileType = fileType;
    this.data = data;
    this.yacht = yacht;
  }
}
