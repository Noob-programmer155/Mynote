package com.amrtm.mynoteapps.entity.repository.note;

import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.entity.other.obj.Severity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public interface NoteCollabRepo<E extends NoteCollab,PagingAndSorting> extends NoteRepo<E, UUID> {
    Flux<E> findBySubtype(UUID subtype,UUID group);
    Flux<E> findByTitleLikeAndGroupMember(String name, UUID group, PagingAndSorting pageable);
    Flux<E> findByFilterGroupMember(List<String> severity, List<UUID> subtype, String member, UUID group, PagingAndSorting pageable);
    Flux<Severity> findSeverityByGroup(UUID group);
    Mono<Void> updateSubtypeGroup(UUID group, UUID oldSubtype, UUID newSubtype);
    Mono<Void> deleteByGroupAndSubtype(UUID group, UUID subtype);
    Mono<Void> deleteByGroup(UUID group);
    @Override
    <S extends E> Mono<S> save(S entity);
}
