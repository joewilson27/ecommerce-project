package com.wilson.ecommerce.dto;

import lombok.Data;

// we use this class to send back a Java Object as JSON
@Data
public class PurchaseResponse {

    private String orderTrackingNumber;

}
