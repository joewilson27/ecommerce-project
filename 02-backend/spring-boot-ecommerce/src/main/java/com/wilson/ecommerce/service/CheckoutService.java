package com.wilson.ecommerce.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.wilson.ecommerce.dto.PaymentInfo;
import com.wilson.ecommerce.dto.Purchase;
import com.wilson.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    // PaymentIntent from Stripe
    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;

}
