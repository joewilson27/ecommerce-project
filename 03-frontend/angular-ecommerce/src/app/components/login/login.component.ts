import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { 
    // sample from other source https://github.com/okta/samples-js-angular/blob/master/custom-login/src/app/login/login.component.ts
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0], 
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });
  }
  // baseUrl --> give the URL before /oauth2 --> https://dev-00085090.okta.com
  // pkce: true --> we're going to make use of dynamic secrets for passing the information between our app and the authorization server

  ngOnInit(): void {
    this.oktaSignin.remove(); // just to remove any previous elements that were there that were rendered

    // render elements, which element to render. Render element with the given id ('okta-sign-in-widget') 
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'}, // this name should be the same as div tag id in login.component.html
      (response: any) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }

}
