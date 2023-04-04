package com.amrtm.mynoteapps.backend.repository;

import com.amrtm.mynoteapps.backend.model.GlobalEntity;
import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;
import reactor.core.publisher.Mono;

public interface MyNoteRepo<E extends MyNoteEntity,ID> extends GlobalEntity {
    Mono<E> findById(ID id);
    Mono<Void> deleteById(ID id);
    <S extends E> Mono<S> save(S entity);
}
