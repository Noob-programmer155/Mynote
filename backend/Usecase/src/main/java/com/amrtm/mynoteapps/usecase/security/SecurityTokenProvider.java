package com.amrtm.mynoteapps.usecase.security;


import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.other.Role;
import reactor.core.publisher.Mono;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

public abstract class SecurityTokenProvider {
    protected abstract long lastExpired();

    protected abstract void initKey() throws NoSuchAlgorithmException;

    private KeyPair generateKey() throws NoSuchAlgorithmException {
        KeyPairGenerator keyGenerator = KeyPairGenerator.getInstance("RSA");
        keyGenerator.initialize(2048);
        return keyGenerator.genKeyPair();
    }

    public abstract Mono<String> createToken(String username, Role role);

    public abstract Mono<Pair<String, Role>> validateToken(String token);

    public abstract Mono<Pair<String,Long>> getUsernameAndDateExpired(String token);

    public Mono<Boolean> validateDate(long date) {
        long end = new Date().getTime();
        long start = end - lastExpired();
        return Mono.just((start <= date) && (date < end));
    }
}
