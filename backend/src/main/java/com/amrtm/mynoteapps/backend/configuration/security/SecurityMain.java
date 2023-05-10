package com.amrtm.mynoteapps.backend.configuration.security;

import com.amrtm.mynoteapps.entity.other.Role;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.time.Duration;
import java.util.List;

public class SecurityMain {
    public static SecurityWebFilterChain httpConfiguration(ServerHttpSecurity http, ServerSecurityContextRepository securityContextRepository,
                                                           ReactiveAuthenticationManager authenticationManager,List<String> origin){
        http
                .cors().configurationSource(corsConfiguration(origin))
                .and()
                .csrf().disable()
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

    public static CorsConfigurationSource corsConfiguration(List<String> origin) {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(origin);
        cors.setAllowCredentials(true);
        cors.addAllowedMethod(CorsConfiguration.ALL);
        cors.setMaxAge(Duration.ofSeconds(3600));
        cors.applyPermitDefaultValues();

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**",cors);

        return urlBasedCorsConfigurationSource;
    }
}
