package com.amrtm.mynoteapps.backend.configuration;

import com.amrtm.mynoteapps.adapter.database.repository.MemberRepoAdapter;
import com.amrtm.mynoteapps.backend.configuration.security.AuthenticationManagerCustom;
import com.amrtm.mynoteapps.backend.configuration.security.SecurityContextCustom;
import com.amrtm.mynoteapps.backend.configuration.security.SecurityMain;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.ReactiveAuditorAware;
import org.springframework.data.r2dbc.config.EnableR2dbcAuditing;
import org.springframework.http.codec.ServerCodecConfigurer;
import org.springframework.http.codec.multipart.DefaultPartHttpMessageReader;
import org.springframework.http.codec.multipart.MultipartHttpMessageReader;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.reactive.config.WebFluxConfigurer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

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
    @Autowired MemberRepoAdapter memberRepoAdapter;
    @Autowired AuthenticationManagerCustom authenticationManager;

    @Bean
    public ReactiveAuditorAware<String> auditorAware() {
        return () -> ReactiveSecurityContextHolder.getContext()
            .map(SecurityContext::getAuthentication)
            .filter(Authentication::isAuthenticated)
            .map(Authentication::getPrincipal)
                .flatMap(item -> memberRepoAdapter.findByName((String) item))
            .map(item -> item.getUsername()+delimiter+item.getId().toString());
    }

    // Security
    Logger log = Logger.getGlobal();
    @Bean
    SecurityWebFilterChain http(ServerHttpSecurity http) throws IOException {
        URL url = new URL("http://checkip.amazonaws.com");
        BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
        ArrayList<String> originUrl = new ArrayList<>(Arrays.stream(origin.split(delimiter)).toList());
        originUrl.add("http://"+in.readLine());
        log.info(originUrl.get(2));
        return SecurityMain.httpConfiguration(http,securityContextCustom,authenticationManager,originUrl);
    }
}
