package com.amrtm.mynoteapps.backend.configuration.security;

import com.amrtm.mynoteapps.backend.model.other.Role;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.logout.DelegatingServerLogoutHandler;
import org.springframework.security.web.server.authentication.logout.SecurityContextServerLogoutHandler;
import org.springframework.security.web.server.authentication.logout.WebSessionServerLogoutHandler;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.time.Duration;
import java.util.List;

public class SecurityMain {
    public static SecurityWebFilterChain httpConfiguration(ServerHttpSecurity http, ServerSecurityContextRepository securityContextRepository,
                                                           ReactiveAuthenticationManager authenticationManager){
        http
                .csrf().disable()
                .cors()
                .and()
                .headers(ServerHttpSecurity.HeaderSpec::disable)
                .securityContextRepository(securityContextRepository)
                .authenticationManager(authenticationManager)
                .authorizeExchange((auth) -> auth
                        .pathMatchers("/api/v1/public/**").permitAll()
                        .pathMatchers("/api/v1/user/**").hasAuthority(Role.USER.toString())
                        .anyExchange().authenticated()
                )
                .logout().disable();
        return http.build();
    }

    public static CorsWebFilter corsConfiguration(List<String> origin) {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(origin);
        cors.setAllowCredentials(true);
        cors.addAllowedMethod(CorsConfiguration.ALL);
        cors.setMaxAge(Duration.ofSeconds(3600));

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**",cors);

        return new CorsWebFilter(urlBasedCorsConfigurationSource);
    }
}
