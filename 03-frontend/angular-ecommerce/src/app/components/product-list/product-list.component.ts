import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword!: string;

  // inject our ProductService
  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }
  // inject the activatedroute, useful for accessing route parameters

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      // listProducts dapat menggunakan paramMap karena sudah di bind oleh route (ActivatedRoute)
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has("keyword"); // this 'keyword' passed in from SearchComponent

    // this.route.snapshot.paramMap
    // route => activatedRoute
    // snapshot => state of route at this given moment in time
    // paramMap => Map of all the route parameters
    // has("keyword") => read the keyword parameter in querystring, 'string' adl nama pada path

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }

  handleSearchProducts() {
    
    const theKeyword: string = this.route.snapshot.paramMap.get("keyword")!;

    // if we have a different keyword than previous 
    // then set thePageNumber to 1

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1; // reset page number 
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber -1, 
                                               this.thePageSize, 
                                               theKeyword)
                                              .subscribe(this.processResult());

    // old code withour search product paginate
    // this.productService.searchProducts(theKeyword).subscribe(data => {
    //   this.products = data;
    // });

  }

  handleListProducts() {

      // check if "id" parameter is available
      const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

      if (hasCategoryId) {
        // get the "id" param string. convert string to a number using the "+" symbol
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!; // another way -> +this.route.snapshot.params["id"]; // 
        // + parameter value is returned as string. Use the "+" symbol to convert to number
  
        // get the "name" param string
        this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
      }
      else {
        // not category_id available... default to cateogry id 1 and category name book
        this.currentCategoryId = 1;
        this.currentCategoryName = 'Books';
      }

      //
      // Check if we have a different category than the previous 
      // Note: Angular will reuse a component if it is being viewed 

      // if we have a different category id than the previous
      // then set thePageNumber back to 1
      if (this.previousCategoryId != this.currentCategoryId) {
        this.thePageNumber = 1; // reset page number 
      }

      this.previousCategoryId = this.currentCategoryId;

      console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);
      
      // now get the products for the given category id
      this.productService.getProductListPaginate(this.thePageNumber -1, // the reason -1 because pagination in angular is 1-based then the spring data rest is 0-based
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(this.processResult());
      
      // old version without pagination
      // this.productService.getProductList(this.currentCategoryId).subscribe( //   it executes the observal, it's a method that comes from rxjs library which Angular is using internally.
      //   data => {
      //     this.products = data;
      //   }
      // ) // method is invoked once you "subscribe"
  }

  private processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {

    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    // TO DO ... do the real work
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
