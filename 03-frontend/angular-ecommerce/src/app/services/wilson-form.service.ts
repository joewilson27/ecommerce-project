import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WilsonFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    
    let data: number[] = [];

    // build an array for "Month" dropdown list
    // - start at current month and loop until

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
   }

   return of(data); // the "of" operator from rxjs will wrap an object as an Observable
   // we use an observable here because our angular component is going to subscribe to this method to receive the async data
  } 

  getCreditCardYears(): Observable<number[]> {
    
    let data: number[] = [];

    // build an array for "Year" dropdown list
    // - start at current year and loop for next 10 years
    
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }

}
