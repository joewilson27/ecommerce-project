export default {

    oidc: {
        clientId: '0oa6mp61dlwaxJYYX5d7', // from okta, public id
        issuer: 'https://dev-00085090.okta.com/oauth2/default', // URL when authorizing with Okta Authorization Server
        redirectUri: 'https://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email']
        /**
         * scopes information:
         * - openid: required for authentication requests 
         * - profile: user's first name, last name, phone etc
         * - email: user'email address
         *  */   
    }

}
