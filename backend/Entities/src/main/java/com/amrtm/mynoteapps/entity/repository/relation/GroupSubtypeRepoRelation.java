package com.amrtm.mynoteapps.entity.repository.relation;

import com.amrtm.mynoteapps.entity.relation.GroupSubtypeRel;
import com.amrtm.mynoteapps.entity.repository.MyNoteStoreRepoRelation;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface GroupSubtypeRepoRelation<E extends GroupSubtypeRel> extends MyNoteStoreRepoRelation<UUID,E> {
    Mono<Void> updateIndex(Integer index, UUID parent, UUID child);
    Mono<Void> deleteByParentAndChild(UUID parent, UUID child);
    @Override
    <S extends E> Mono<S> save(S entity);
}
