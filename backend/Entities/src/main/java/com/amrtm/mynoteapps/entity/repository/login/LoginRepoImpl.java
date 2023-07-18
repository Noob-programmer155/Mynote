package com.amrtm.mynoteapps.entity.repository.login;

import com.amrtm.mynoteapps.entity.model.login.Login;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface LoginRepoImpl<E extends Login> extends LoginRepo<E,UUID> {
    Mono<E> findByName(String username);
    Mono<Void> update(E entity);
}
