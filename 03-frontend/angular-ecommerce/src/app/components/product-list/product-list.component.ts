import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  currentCategoryName: string;
  searchMode: boolean;
  // inject our ProductService
  constructor(private productService: ProductService,
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

    // now search for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(data => {
      this.products = data;
    });

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
  
      // now get the products for the given category id
      this.productService.getProductList(this.currentCategoryId).subscribe( //   it executes the observal, it's a method that comes from rxjs library which Angular is using internally.
        data => {
          this.products = data;
        }
      ) // method is invoked once you "subscribe"

  }

}
