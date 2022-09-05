import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { WilsonFormService } from 'src/app/services/wilson-form.service';
import { WilsonValidators } from 'src/app/validators/wilson-validators';

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
  
  constructor(private formBuilder: FormBuilder,
             private wilsonFormService: WilsonFormService,
             private cartService: CartService) { }

  ngOnInit(): void {

    this.reviewCartDetails();

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
        email: new FormControl('',
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
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2), 
                                          WilsonValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

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

    // populate countries
    this.wilsonFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

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
    }

    console.log(this.checkoutFormGroup.get("customer").value);
    console.log("The email address is " + this.checkoutFormGroup.get("customer").value.email);

    console.log("The shipping address country is " + this.checkoutFormGroup.get("shippingAddress").value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get("shippingAddress").value.state.name);

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
        formGroup.get('state').setValue(data[0]);
      }
    );


  }

}
