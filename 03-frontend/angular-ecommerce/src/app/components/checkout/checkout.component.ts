import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { WilsonFormService } from 'src/app/services/wilson-form.service';
import { WilsonValidators } from 'src/app/validators/wilson-validators';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from 'src/app/common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;
  
  // initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";


  constructor(private formBuilder: FormBuilder,
             private wilsonFormService: WilsonFormService,
             private cartService: CartService,
             private checkoutService: CheckoutService,
             private router: Router) { }

  ngOnInit(): void {

    // setup Stripe payment form
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    // read the user's email address from the browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                                [Validators.required, 
                                Validators.minLength(2), 
                                WilsonValidators.notOnlyWhitespace]), // notOnlyWhitespace dari wilson-validators (custom)
        lastName: new FormControl('', 
                                [Validators.required, 
                                 Validators.minLength(2),
                                 WilsonValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, // fulfilled email field on form 
                                [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
                                     WilsonValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
                                   WilsonValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                                     WilsonValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
                                     WilsonValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
                                   WilsonValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                                     WilsonValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        /*  comment this for change to Stripe
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2), 
                                          WilsonValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
        */
      })
    });

    /* comment this for change to Stripe
    // populate credit card months
    const startMonths: number = new Date().getMonth() + 1; // +1 because getMonths is 0-based
    console.log("startMonths: " + startMonths);

    this.wilsonFormService.getCreditCardMonths(startMonths).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.wilsonFormService.getCreditCardYears().subscribe(data => {
      console.log("Retrieved credit card years: " + JSON.stringify(data));
      this.creditCardYears = data;
    });
    */

    // populate countries
    this.wilsonFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }
  
  setupStripePaymentForm() {
    
    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element'); // ini pada div id card-element di checkout.component.html utk di inject

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }
    });

  }

  reviewCartDetails() {
    
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  // getters
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); } // you know how to read this line, right?, firstName ini yg di taruh di div handled error dibawah kolom input-nya
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  
  copyShippingAddressToBillingAddress(event: any) {
    // cara copy dari form Shipping Address ke Billing Address
    if (event.target.checked) {
       this.checkoutFormGroup.controls['billingAddress']
           .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      //console.log('zz',this.checkoutFormGroup.controls['shippingAddress'].value);
      // bug fix for states, kalau kita checkbox pada form shippingAddress maka kolom state pada section billingAddress tidak meng-copy dari kolom state pada shippingAddress
      this.billingAddressStates = this.shippingAddressStates;

    } else {
      // reset form if unchecked
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }

  }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched(); // Touching all fields triggers the display of the error messages
      return;
    }

    // console.log(this.checkoutFormGroup.get("customer").value);
    // console.log("The email address is " + this.checkoutFormGroup.get("customer").value.email);

    // console.log("The shipping address country is " + this.checkoutFormGroup.get("shippingAddress").value.country.name);
    // console.log("The shipping address state is " + this.checkoutFormGroup.get("shippingAddress").value.state.name);

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for (let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    // - short way of doing the same thing (looping yg di atas)
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value; // disini masukin field yang biasa street, city, zipcode
    console.log("print", purchase.shippingAddress);
    console.log("state", purchase.shippingAddress.state);
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        // next: success
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();

        },
        // error: error/exception
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    )

  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0); // send out zero to all subscribers there, jadi biar cart nya jadi 0 lagi
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with the current month, avoid previous month if this 
    // condition fulfilled

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.wilsonFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      } 
    );

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.wilsonFormService.getStates(countryCode).subscribe(
      data => {

        // check if country from shippingAddress formgroup
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } 
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state').setValue(data[0]);
      }
    );


  }

}
