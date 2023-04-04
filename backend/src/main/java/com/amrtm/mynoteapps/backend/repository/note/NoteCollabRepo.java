package com.amrtm.mynoteapps.backend.repository.note;

import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollab;
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
public interface NoteCollabRepo extends NoteRepo<NoteCollab, UUID>, ReactiveCrudRepository<NoteCollab, UUID>, ReactiveSortingRepository<NoteCollab, UUID> {
    @Query("SELECT DISTINCT n.* FROM note AS n JOIN group_member AS gm ON gm.member = n.member WHERE gm.group_note = :groupNote AND (COALESCE(:member) = '00000000-0000-0000-0000-000000000000' OR n.member = :member) AND n.subtype IS NOT NULL AND n.title LIKE '%'||:name||'%'")
    Flux<NoteCollab> findByTitleLikeAndGroupMember(String name, UUID member, UUID group, Pageable pageable);
    @Query("SELECT n.* FROM note AS n JOIN group_member AS gm ON gm.member = n.member WHERE (COALESCE(:severity) = '' OR n.severity IN (:severity)) AND (COALESCE(:subtype) = '00000000-0000-0000-0000-000000000000' OR n.subtype IN (:subtype)) AND (COALESCE(:member) = '00000000-0000-0000-0000-000000000000' OR n.member = :member) AND gm.group_note = :group AND n.subtype IS NOT NULL")
    Flux<NoteCollab> findByFilterGroupMember(List<String> severity, List<UUID> subtype, UUID member, UUID group, Pageable pageable);
    @Transactional
    @Override
    <S extends NoteCollab> Mono<S> save(S entity);
}
