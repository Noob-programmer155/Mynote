package com.amrtm.mynoteapps.entity.repository.theme;

import com.amrtm.mynoteapps.entity.model.theme.impl.Theme;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface ThemeRepoImpl<E extends Theme,PagingAndSorting> extends ThemeRepo<E, UUID, PagingAndSorting> {
    Mono<E> findByIdMemberActive(UUID member);
    Flux<E> findByNameLikeAndMember(String name, UUID member, PagingAndSorting pageable);
    Flux<E> findByNameLike(String name, UUID member, PagingAndSorting pageable);
    @Override
    <S extends E> Mono<S> save(S entity);
}
