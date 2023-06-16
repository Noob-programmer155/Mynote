package com.amrtm.mynoteapps.backend.configuration.security.impl;

import com.amrtm.mynoteapps.adapter.router.routerfunc.exception.ErrorGlobal;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;

import javax.security.auth.login.AccountNotFoundException;
import java.io.FileNotFoundException;
import java.security.NoSuchAlgorithmException;
import java.util.LinkedList;
import java.util.List;

public class ErrorBindException extends ErrorGlobal {
    @Override
    public List<Class<? extends Exception>> systemException() {
        List<Class<? extends Exception>> list = new LinkedList<>();
        list.add(RuntimeException.class);
        list.add(NoSuchAlgorithmException.class);
        list.add(FileNotFoundException.class);
        return list;
    }

    @Override
    public List<Class<? extends Exception>> humanException() {
        List<Class<? extends Exception>> list = new LinkedList<>();
        list.add(IllegalArgumentException.class);
        list.add(IllegalStateException.class);
        return list;
    }

    @Override
    public List<Class<? extends Exception>> authException() {
        List<Class<? extends Exception>> list = new LinkedList<>();
        list.add(AuthenticationCredentialsNotFoundException.class);
        list.add(AccountNotFoundException.class);
        list.add(IllegalAccessException.class);
        list.add(SignatureException.class);
        list.add(MalformedJwtException.class);
        return list;
    }
    public List<Class<? extends Exception>> jwtExpiredRefresh() {
        List<Class<? extends Exception>> list = new LinkedList<>();
        list.add(ExpiredJwtException.class);
        return list;
    }
}
