package com.amrtm.mynoteapps.entity.repository.subtype;

import com.amrtm.mynoteapps.entity.other.bind.SubtypeColorBinding;
import com.amrtm.mynoteapps.entity.model.subtype.impl.Subtype;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface SubtypeRepoImpl<E extends Subtype,PagingAndSorting> extends SubtypeRepo<E, UUID, PagingAndSorting> {
    Mono<E> findByName(String name);
    Flux<E> findByNameLike(String name, PagingAndSorting pageable);
    Flux<SubtypeColorBinding> findByGroup(UUID group);
    @Override
    <S extends E> Mono<S> save(S entities);
    @Override
    Mono<Void> deleteAllById(Iterable<? extends UUID> uuids);
}
