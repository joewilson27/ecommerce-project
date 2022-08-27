package com.wilson.ecommerce.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name="state")
@Data
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="name")
    private String name;

    @ManyToOne
    @JoinColumn(name="country_id") // country_id adalah column yg akan di buat pada table state
    private Country country;

}
