import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0); // new Subject<number>(0); // Subject is a subclass of Obversable. we can use Subject to publish events in our code. The event will be sent to all of the subscribers.
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0); // BehaviorSubject will give the latest value
  // jadi, dengan BehaviorSubject, meski nilai ini di update terakhir, dia tetap akan memberikan latest value dari hasil perubahan
  // nilai ini 
  
  //storage: Storage = sessionStorage; // reference to web browser's session storage --> close browser, data loss
  // instead of sessionStorage, we use localStorage
  storage: Storage = localStorage; // close browser and re-open, data is persisted and survives browser restart, data tetap ada meski browser di restart

  constructor() { 

    // read data from session storage, then convert to JSON
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this.cartItems = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }

  }

  addToCart(theCartItem: CartItem) {

    // check if we already have the item in our cart 
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined; // let existingCartItem: CartItem = undefined; -> type 'undefined' is not assignable to type CartItem

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id 
      
      // refactor code right after this code
      // for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }

      // new way 
      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id);

      // check if we found it 
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    }
    else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue); // .next() will publish an event, so then the subscribers will receive the new values
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    // Persist cart data 
    this.persistcartItems();
  }

  persistcartItems() {
    // set data to sesion storage, convert data from Object to JSON String
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    
    console.log("Contents of the cart");
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity= ${tempCartItem.quantity}, unitPrice= ${tempCartItem.unitPrice}, subTotalPrice= ${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue.toFixed(2)}`);
    console.log('----');
  }

  decrementQuantity(theCartItem: CartItem) {
    
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }

  }

  remove(theCartItem: CartItem) {
    
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id );

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      // calculate the result
      this.computeCartTotals();
    }
  }

}
