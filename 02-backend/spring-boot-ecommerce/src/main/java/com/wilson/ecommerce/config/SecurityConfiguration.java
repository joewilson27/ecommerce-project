package com.wilson.ecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // protect endpoint /api/orders
        // Lambda expression using Spring Security Lambda DSL
        http.authorizeRequests(configurer ->
                        configurer
                                .antMatchers("/api/orders/**") // protect this endpoint
                                .authenticated())
                .oauth2ResourceServer() // configures OAuth2 Resource Server support
                .jwt(); // Enables JWT-encoded bearer token support

        // add CORS filter
        http.cors();

        // add content negotiation strategy, to support Okta sending back a friendly response
        http.setSharedObject(ContentNegotiationStrategy.class,
                            new HeaderContentNegotiationStrategy());

        // force a non-empty response body for 401's to make the response more friendly
        Okta.configureResourceServer401ResponseBody(http);

        // Disable CSRF since we are not using Cookies for session tracking
        http.csrf().disable();

        return http.build(); // HttpSecurity supports the Builder design pattern hence, we can "build it" to return the instance
    }

}
