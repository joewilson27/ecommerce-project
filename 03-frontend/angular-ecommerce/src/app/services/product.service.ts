import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs'; // reactive JavaScript

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  /**
   * 
   * @returns an observable. Map the JSON data from Spring Data REST to product array
   */
  getProductList(): Observable<Product[]> {
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
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
