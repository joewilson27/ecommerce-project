package com.wilson.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "mysampletab")
@Getter
@Setter
public class MySampleTab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // learn it later
    @Column(name="id")
    private Long id;

    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @Column(name="deleted")
    private Long deleted;

}
