package com.amrtm.mynoteapps.backend.repository.subtype;

import com.amrtm.mynoteapps.backend.model.subtype.impl.Subtype;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface SubtypeRepoImpl extends SubtypeRepo<Subtype, UUID>, ReactiveCrudRepository<Subtype,UUID>, ReactiveSortingRepository<Subtype,UUID> {
    @Query("SELECT * FROM subtype WHERE name LIKE '%'||:name||'%'")
    Flux<Subtype> findByNameLike(String name, Pageable pageable);

    @Query("SELECT s.* FROM group_subtype AS gs JOIN subtype AS s ON gs.subtype = s.id WHERE gs.group_note = :group AND s.name LIKE '%'||:name||'%'")
    Flux<Subtype> findByNameLikeGroup(String name, UUID group, Pageable pageable);

    @Transactional
    @Override
    <S extends Subtype> Mono<S> save(S entities);

    @Transactional
    @Override
    Mono<Void> deleteAllById(Iterable<? extends UUID> uuids);
}
