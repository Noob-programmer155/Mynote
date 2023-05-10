package com.amrtm.mynoteapps.entity.repository.other;

import com.amrtm.mynoteapps.entity.GlobalEntity;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface LoginRepo<E extends GlobalEntity,ID> {
    Mono<E> findByName(String username);
    <S extends E> Mono<S> save(S entity);
    <S extends E> Mono<S> update(S entity);
    Mono<Void> deleteById(UUID uuid);
}
