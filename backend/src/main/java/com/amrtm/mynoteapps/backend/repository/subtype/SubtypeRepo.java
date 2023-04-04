package com.amrtm.mynoteapps.backend.repository.subtype;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;
import com.amrtm.mynoteapps.backend.repository.MyNoteRepo;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface SubtypeRepo<E extends MyNoteEntity,ID> extends MyNoteRepo<E, ID> {
    Flux<E> findByNameLike(String name,Pageable pageable);
    Flux<E> findByNameLikeGroup(String name, ID group, Pageable pageable);
    Mono<Void> deleteAllById(Iterable<? extends ID> uuids);
}
