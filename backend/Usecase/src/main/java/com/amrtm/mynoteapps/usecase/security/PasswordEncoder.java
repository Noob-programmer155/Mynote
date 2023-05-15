package com.amrtm.mynoteapps.usecase.security;

public interface PasswordEncoder {
    String encode(String message);
    Boolean matches(String message,String encMessage);
}
