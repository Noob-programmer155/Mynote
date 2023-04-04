package com.amrtm.mynoteapps.backend.configuration.security;

import com.amrtm.mynoteapps.backend.service.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.stream.Stream;


@Component
@RequiredArgsConstructor
public class AuthenticationManagerCustom implements ReactiveAuthenticationManager {
    private final JwtProvider provider;
    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        String token = authentication.getCredentials().toString();
        return provider.validateToken(token)
                .flatMap(item -> Mono.just(new UsernamePasswordAuthenticationToken(item.getFirst(),null, Stream.of(item.getSecond().toString())
                        .map(SimpleGrantedAuthority::new).toList())));
    }
}
