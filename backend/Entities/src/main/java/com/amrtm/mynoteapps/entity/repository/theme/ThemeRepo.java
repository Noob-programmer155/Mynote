package com.amrtm.mynoteapps.entity.repository.theme;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;
import com.amrtm.mynoteapps.entity.repository.MyNoteRepo;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ThemeRepo<E extends MyNoteEntity,ID,PagingAndSorting> extends MyNoteRepo<E, ID> {
    Mono<E> findByName(String name);
    Flux<E> findByNameLike(String name, PagingAndSorting pageable);
    Flux<E> findByNameLikeAndMember(String name, ID member, PagingAndSorting pageable);
    Mono<E> findByIdMemberActive(ID member);
}