package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.entity.GlobalEntity;
import com.amrtm.mynoteapps.entity.main.MyNoteEntity;
import reactor.core.publisher.Mono;

public interface MyNoteRepo<E extends MyNoteEntity,ID> extends GlobalEntity {
    Mono<E> findById(ID id);
    Mono<Void> deleteById(ID id);
    <S extends E> Mono<S> save(S entity);
}
