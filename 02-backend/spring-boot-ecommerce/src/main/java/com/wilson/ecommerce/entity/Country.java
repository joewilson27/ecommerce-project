package com.wilson.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name="country")
@Getter
@Setter
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="code")
    private String code;

    @Column(name="name")
    private String name;

    @OneToMany(mappedBy = "country") // country adl property yg di set pada table relasinya --> private; Country country pada class State
    @JsonIgnore // will ignore the states, so if we call the API from this entity, the result is not going to show this field
    private List<State> states;

}
