package com.amrtm.mynoteapps.backend.configuration.security.impl;

import com.amrtm.mynoteapps.usecase.security.AuthValidation;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class AuthValidationClass implements AuthValidation {

    @Override
    public Mono<String> getValidation() {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .map(item -> (String) item.getPrincipal())
                .switchIfEmpty(Mono.error(new AuthenticationCredentialsNotFoundException("you`re not allowed")));
    }
}
