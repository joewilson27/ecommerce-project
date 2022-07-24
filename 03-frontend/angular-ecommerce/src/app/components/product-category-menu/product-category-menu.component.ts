import { Component, OnInit } from '@angular/core';
import { MySampleTab } from 'src/app/common/my-sample-tab';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
import { MysampletabService } from 'src/app/services/mysampletab.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories?: ProductCategory[];
  mySampleTab?: MySampleTab[];

  constructor(private productService: ProductService,
              private mySampleTabService: MysampletabService) { }

  ngOnInit(): void {
    this.listProductCategories();
    this.listMySampleTabs();
  }

  listProductCategories() {
    
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data;
      }
    );

  }

  listMySampleTabs() {
    // success get data and printed to view
    this.mySampleTabService.getMysampleTab().subscribe(data => {
      this.mySampleTab = data;
    });

  }

  convertJson(value: any): string {
    return JSON.stringify(value);
  }

}
