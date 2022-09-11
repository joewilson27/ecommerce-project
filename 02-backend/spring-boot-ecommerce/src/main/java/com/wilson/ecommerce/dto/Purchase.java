package com.wilson.ecommerce.dto;

import com.wilson.ecommerce.entity.Address;
import com.wilson.ecommerce.entity.Customer;
import com.wilson.ecommerce.entity.Order;
import com.wilson.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
