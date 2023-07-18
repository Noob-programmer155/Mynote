package com.amrtm.mynoteapps.entity.repository.login;

import com.amrtm.mynoteapps.entity.GlobalEntity;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface LoginRepo<E extends GlobalEntity,ID> {
    Mono<E> findByName(String username);
    Mono<Void> save(E entity);
    Mono<Void> update(E entity);
    Mono<Void> deleteById(UUID uuid);
}
