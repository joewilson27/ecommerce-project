package com.wilson.ecommerce.dao;

import com.wilson.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

/*
* we have a different origin, and the reason it's a different origin here is because the port numbers are different,
* where the backend running on port 8080 and frontend running on port 4200, so we need this @CrossOrigin annotation
* */
@CrossOrigin("http://localhost:4200") // this server that our Angular app (frontend) is running on. Accept calls from web browser scripts for this origin
public interface ProductRepository extends JpaRepository<Product, Long> {
}
