package com.wilson.ecommerce.dao;

import com.wilson.ecommerce.entity.MySampleTab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

/*
* Original tabs without annotation @RepositoryRestResource:
* mySampleTabs:
* href:	"http://localhost:8080/api/mySampleTabs{?page,size,sort}"
*
*
* after using annotation @RepositoryRestResource:
* mySampleTab:
* href:	"http://localhost:8080/api/my-sample-tab{?page,size,sort}"
* */
//@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "mySampleTab", path = "my-sample-tab")
public interface MySampleTabRepository extends JpaRepository<MySampleTab, Long> {
}
