package com.amrtm.mynoteapps.usecase.security;

import com.amrtm.mynoteapps.entity.user.member.impl.Member;
import reactor.core.publisher.Mono;

public interface AuthValidation {
    Mono<String> getValidation();
}
