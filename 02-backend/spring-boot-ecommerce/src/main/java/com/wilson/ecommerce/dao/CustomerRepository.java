package com.wilson.ecommerce.dao;

import com.wilson.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Customer findByEmail(String theEmail); // same as -> SELECT * FROM customer c WHERE c.email = theEmail // return null if not found
}
