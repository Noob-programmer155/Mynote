package com.amrtm.mynoteapps.backend.configuration;

import com.amrtm.mynoteapps.backend.configuration.security.AuthenticationManagerCustom;
import com.amrtm.mynoteapps.backend.configuration.security.SecurityContextCustom;
import com.amrtm.mynoteapps.backend.configuration.security.SecurityMain;
import com.amrtm.mynoteapps.usecase.repository.user.MemberRepoImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.ReactiveAuditorAware;
import org.springframework.data.r2dbc.config.EnableR2dbcAuditing;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.server.SecurityWebFilterChain;

import java.util.List;

@Configuration
@EnableR2dbcAuditing
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class ConfigurationMain {

    @Value("${application.array.delimiter}")
    private String delimiter;

    @Value("${origin.url}")
    private String origin;

    @Autowired SecurityContextCustom securityContextCustom;
    @Autowired MemberRepoImpl memberRepo;
    @Autowired AuthenticationManagerCustom authenticationManager;

    @Bean
    public ReactiveAuditorAware<String> auditorAware() {
        return () -> ReactiveSecurityContextHolder.getContext()
            .map(SecurityContext::getAuthentication)
            .filter(Authentication::isAuthenticated)
            .map(Authentication::getPrincipal)
                .flatMap(item -> memberRepo.findByName((String) item))
            .map(item -> item.getUsername()+delimiter+item.getId().toString());
    }

    // Security
    @Bean
    SecurityWebFilterChain http(ServerHttpSecurity http) {
        return SecurityMain.httpConfiguration(http,securityContextCustom,authenticationManager,List.of(origin.split(delimiter)));
    }
}
