package com.amrtm.mynoteapps.entity.repository.relation;

import com.amrtm.mynoteapps.entity.model.relation.SubtypeNoteRel;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface SubtypeNoteRepoRelation<E extends SubtypeNoteRel> {
    Mono<Void> deleteByParentAndChild(Long parent, UUID child);
    <S extends E> Mono<S> save(S entity);
}
