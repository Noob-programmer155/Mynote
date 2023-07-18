package com.amrtm.mynoteapps.usecase.security;

import reactor.core.publisher.Mono;

public interface AuthValidation {
    Mono<String> getValidation();
}
