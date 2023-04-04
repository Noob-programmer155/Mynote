package com.amrtm.mynoteapps.backend.service.security;

import com.amrtm.mynoteapps.backend.model.other.Role;
import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.util.Date;

@Component
public class JwtProvider {
    @Value("${jwt.expired}")
    private long expired;
    @Value("${jwt.expired.valid}")
    private long lastExpired;

    private PrivateKey keyInstance;

    @PostConstruct
    void initKey() throws NoSuchAlgorithmException {
        this.keyInstance = generateKey();
    }

    private PrivateKey generateKey() throws NoSuchAlgorithmException {
        KeyPairGenerator keyGenerator = KeyPairGenerator.getInstance("RSA");
        keyGenerator.initialize(2048);
        return keyGenerator.genKeyPair().getPrivate();
    }

    public Mono<String> createToken(String username, Role role) {
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("role",role.toString());
        return Mono.just(Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime()+expired))
                .signWith(keyInstance, SignatureAlgorithm.RS256)
                .compact());
    }

    public Mono<Pair<String,Role>> validateToken(String token) {
        Jws<Claims> tkn = Jwts.parserBuilder().setSigningKey(keyInstance).build().parseClaimsJws(token);
        return Mono.just(Pair.of(tkn.getBody().getSubject(),Role.valueOf((String) tkn.getBody().get("role"))));
    }

    public Mono<Pair<String,Long>> getUsernameAndDateClaimJwtExpired(String token) {
        try {
            validateToken(token);
            return Mono.empty();
        } catch (ExpiredJwtException e) {
            return Mono.just(Pair.of(e.getClaims().getSubject(),e.getClaims().getExpiration().getTime()));
        }
    }

    public Mono<Boolean> validateDate(long date) {
        long end = new Date().getTime();
        long start = end - lastExpired;
        return Mono.just((start <= date) && (date < end));
    }
}
