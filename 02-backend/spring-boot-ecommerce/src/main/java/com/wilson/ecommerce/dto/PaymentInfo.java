package com.wilson.ecommerce.dto;

import lombok.Data;

@Data
public class PaymentInfo {

		private int amount; // don't worry if the amount is like $12.54, because it will convert to cents
		private String currency;

}
