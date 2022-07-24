package com.wilson.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "product_category")
// @Data -- known bug, if you make relationship between data like OneToMany and ManyToOne, or
//  Its just sometimes @Data may not generate all the boiler-plate code for a pojo.
@Getter
@Setter
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "category_name")
    private String categoryName;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "category") // mapped by variable category in Product entity
    private Set<Product> products;
}
