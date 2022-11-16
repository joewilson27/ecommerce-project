import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  // this will intercept all outgoing HTTP requests of HttpClient
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }
  
  // this method will return a Promise. So a Promise is basically a way of having a future with some specific type. in this case HttpEvent
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    // Only add an access token for secured endpoints
    const theEndpoint = environment.wilsonApiUrl + '/orders';
    const securedEndpoint = [theEndpoint];

    if (securedEndpoint.some(url => request.urlWithParams.includes(url))) {

      // get access token
      const accessToken = this.oktaAuth.getAccessToken();

      // clone the request and add new header with access token
      // we clone because request is immutable, meaning that you CAN'T change it directly
      // artinya kita ga bisa langsung copy dan paste si access token, maka kita harus copy clone
      // dan setting headers seperti dibawah
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }

    return await lastValueFrom(next.handle(request));

  }
}
