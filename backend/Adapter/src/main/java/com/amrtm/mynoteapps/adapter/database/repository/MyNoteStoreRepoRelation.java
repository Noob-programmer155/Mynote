package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.entity.main.MyNoteRelationEntity;
import reactor.core.publisher.Mono;

public interface MyNoteStoreRepoRelation<ID,E extends MyNoteRelationEntity<ID>> {
    <S extends E> Mono<S> save(S entity);
    Mono<Void> deleteByParentAndChild(ID parent, ID child);
}
