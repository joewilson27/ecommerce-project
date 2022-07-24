import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MySampleTab } from '../common/my-sample-tab';

@Injectable({
  providedIn: 'root'
})
export class MysampletabService {

  private mySampleTabUrl = 'http://localhost:8080/api/my-sample-tab'; 

  constructor(private httpClient: HttpClient) { }

  getMysampleTab(): Observable<MySampleTab[]> {
    return this.httpClient.get<GetResponseMySampleTab>(this.mySampleTabUrl)
                          .pipe(
                            map(response => response._embedded.mySampleTab)
                          );
  }

}

interface GetResponseMySampleTab {
  _embedded: {
    mySampleTab: MySampleTab[]
  }
}
