package com.amrtm.mynoteapps.usecase.security;

public interface PasswordEncoder {
    String encode(String message);
    String decode(String encMessage);
}
