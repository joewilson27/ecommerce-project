package com.wilson.ecommerce.dao;

import com.wilson.ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
// notes: "productCategory" -> name of JSON entry, "product-category" -> /product-category
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
