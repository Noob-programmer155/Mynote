package com.amrtm.mynoteapps.entity.repository.relation;

import com.amrtm.mynoteapps.entity.relation.ThemeMemberRel;
import com.amrtm.mynoteapps.entity.repository.MyNoteStoreRepoRelation;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface ThemeMemberRepoRelation<E extends ThemeMemberRel> extends MyNoteStoreRepoRelation<UUID,E> {
    Mono<E> findByParentAndChild(UUID parent, UUID child);
    Mono<Void> deleteByParentAndChild(UUID parent, UUID child);
    Mono<E> findByActiveState(UUID member);
    @Override
    <S extends E> Mono<S> save(S entity);
}
