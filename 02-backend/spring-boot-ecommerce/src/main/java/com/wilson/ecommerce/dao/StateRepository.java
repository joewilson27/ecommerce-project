package com.wilson.ecommerce.dao;

import com.wilson.ecommerce.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

//@CrossOrigin("http://localhost:4200")
@RepositoryRestResource
public interface StateRepository extends JpaRepository<State, Integer> {

    // query for finding states by the country code
    List<State> findByCountryCode(@Param("code") String code);
    // this allow us to get the States by the country code in the API like this:
    // http://localhost:8080/api/states/search/findByCountryCode?code=US

}
