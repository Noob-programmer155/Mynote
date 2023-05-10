package com.amrtm.mynoteapps.backend.configuration.security.impl;

import com.amrtm.mynoteapps.usecase.security.PasswordEncoder;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;

public class PasswordEncoderClass implements PasswordEncoder {
    @Override
    public String encode(String message) {
        return SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8().encode(message);
    }

    @Override
    public String decode(String encMessage) {
        return null;
    }
}
