import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs'; // reactive JavaScript

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products'; // size default 20

  constructor(private httpClient: HttpClient) { }

  /**
   * 
   * @returns an observable. Map the JSON data from Spring Data REST to product array
   */
  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

/**
 * Unwraps the JSON from Spring Data REST _embedded entry
 */
interface GetResponse {
  _embedded: {
    products: Product[]
  }
}
