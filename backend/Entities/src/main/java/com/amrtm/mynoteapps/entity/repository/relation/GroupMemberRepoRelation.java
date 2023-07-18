package com.amrtm.mynoteapps.entity.repository.relation;

import com.amrtm.mynoteapps.entity.model.relation.GroupMemberRel;
import com.amrtm.mynoteapps.entity.repository.MyNoteStoreRepoRelation;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface GroupMemberRepoRelation<E extends GroupMemberRel> extends MyNoteStoreRepoRelation<UUID,E> {
    Mono<E> findByParentAndChild(UUID parent, UUID child);
    Mono<E> findByParentAndChildNonAuthorize(UUID parent, UUID child);
    Mono<Void> deleteByParentAndChildAuth(UUID parent, UUID child);
    Mono<Void> deleteByParentAndChild(UUID parent, UUID child);
    @Override
    <S extends E> Mono<S> save(S entity);
}
