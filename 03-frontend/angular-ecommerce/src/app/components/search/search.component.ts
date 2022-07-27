import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(value: string) {
    console.log(`value=${value}`);
    this.router.navigateByUrl(`/search/${value}`); // look to this route -> {path: 'search/:keyword', component: ProductListComponent},
    // Route the data to our "search" route. It will be handled by the ProductListComponent
    // Why ProductListComponent? To reuse the logic and view for listing products,
    // jadi untuk menggunakan logic yg sudah ada dan juga agar bisa sejalan di list products 
  }

}
