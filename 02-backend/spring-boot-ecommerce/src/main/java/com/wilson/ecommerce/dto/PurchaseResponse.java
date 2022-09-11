package com.wilson.ecommerce.dto;

import lombok.Data;

// we use this class to send back a Java Object as JSON
@Data
public class PurchaseResponse {

    private final String orderTrackingNumber; // dengan final, maka magically class ini akan memprovide constructor
    // dan class lain yg menggunakan class ini dapat men-define new PurchaseResponse(someOrderNumber)

//    public PurchaseResponse(String orderTrackingNumber) {
//        this.orderTrackingNumber = orderTrackingNumber;
//    }

}
