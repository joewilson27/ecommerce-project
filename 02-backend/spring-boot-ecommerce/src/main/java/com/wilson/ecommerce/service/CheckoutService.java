package com.wilson.ecommerce.service;

import com.wilson.ecommerce.dto.Purchase;
import com.wilson.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
