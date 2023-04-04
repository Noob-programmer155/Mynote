package com.amrtm.mynoteapps.backend.configuration.security;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class SecurityContextCustom implements ServerSecurityContextRepository {
    private final AuthenticationManagerCustom authenticationManagerCustom;
    @Value("${jwt.header.bearer}")
    private String bearer;
    @Override
    public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {
        return Mono.error(new UnsupportedOperationException("not supported yet."));
    }

    @Override
    public Mono<SecurityContext> load(ServerWebExchange exchange) {
        return Mono.justOrEmpty(exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION))
                .flatMap(this::getAuth)
                .onErrorMap(error -> !(error instanceof ExpiredJwtException),
                        error -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,error.getMessage(),error))
                .onErrorMap(error -> error instanceof ExpiredJwtException
                        ,error -> new ResponseStatusException(HttpStatus.EXPECTATION_FAILED));
    }

    private Mono<SecurityContext> getAuth(String token) {
        if (token != null && !token.isBlank()) {
            token = token.substring(bearer.length()+1);
        }
        Authentication auth = new UsernamePasswordAuthenticationToken(token,token);
        return authenticationManagerCustom.authenticate(auth).map(SecurityContextImpl::new);
    }
}
