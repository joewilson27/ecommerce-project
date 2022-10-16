package com.wilson.ecommerce.dao;

import com.wilson.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

/*
* we have a different origin, and the reason it's a different origin here is because the port numbers are different,
* where the backend running on port 8080 and frontend running on port 4200, so we need this @CrossOrigin annotation
* */
//@CrossOrigin("http://localhost:4200") // this server that our Angular app (frontend) is running on. Accept calls from web browser scripts for this origin
@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {
    // findBy is query method, this will run like select * from product where category_id=?
    // http://localhost:8080/api/products/search/findByCategoryId?id=2
    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);

    Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable);
    /**
     * behind the scene, findByNameContaining will run query like:
     * SELECT * FROM product p WHERE p.name LIKE CONCAT('%', :name, '%')
     */
}
