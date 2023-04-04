package com.amrtm.mynoteapps.backend.repository.note;

import com.amrtm.mynoteapps.backend.model.note.private_note.impl.NotePrivate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotePrivateRepo extends NoteRepo<NotePrivate, UUID>, ReactiveCrudRepository<NotePrivate, UUID>, ReactiveSortingRepository<NotePrivate, UUID> {
    @Query("SELECT * FROM note WHERE member = :member AND title LIKE '%'||:name||'%' AND subtype IS NULL")
    Flux<NotePrivate> findByTitleLike(String name, UUID member, Pageable pageable);
    @Query("SELECT * FROM note WHERE (COALESCE(:severity) = '' OR severity IN (:severity)) AND (COALESCE(:category) = '' OR category IN (:category)) AND member = :member AND subtype IS NULL")
    Flux<NotePrivate> findByFilter(List<String> category, List<String> severity, UUID member, Pageable pageable);
    @Transactional
    @Override
    <S extends NotePrivate> Mono<S> save(S entity);
}
