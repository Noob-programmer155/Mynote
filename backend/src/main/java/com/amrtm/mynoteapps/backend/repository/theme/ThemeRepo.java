package com.amrtm.mynoteapps.backend.repository.theme;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;
import com.amrtm.mynoteapps.backend.repository.MyNoteRepo;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ThemeRepo<E extends MyNoteEntity,ID> extends MyNoteRepo<E, ID> {
    Mono<E> findByName(String name);
    Flux<E> findByNameLike(String name, Pageable pageable);
    Flux<E> findByNameLikeAndMember(String name,ID member,Pageable pageable);
    Mono<E> findByIdMemberActive(ID member);
}