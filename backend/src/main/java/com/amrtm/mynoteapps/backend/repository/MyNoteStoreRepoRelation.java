package com.amrtm.mynoteapps.backend.repository;

import com.amrtm.mynoteapps.backend.model.main.MyNoteRelationEntity;
import com.amrtm.mynoteapps.backend.model.relation.ThemeMemberRel;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface MyNoteStoreRepoRelation<ID,E extends MyNoteRelationEntity<ID>> {
    <S extends E> Mono<S> save(S entity);
    Mono<Void> deleteByParentAndChild(ID parent, ID child);
}
