package com.amrtm.mynoteapps.adapter.database.repository.note;

import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.entity.other.obj.Severity;
import com.amrtm.mynoteapps.entity.repository.note.NoteRepo;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public interface NoteCollabRepo extends NoteRepo<NoteCollab, UUID>, ReactiveCrudRepository<NoteCollab, UUID>, ReactiveSortingRepository<NoteCollab, UUID> {
    @Query("SELECT DISTINCT n.* FROM note AS n JOIN group_member AS gm ON gm.member = n.member JOIN group_subtype AS gs ON gm.group_note = gs.group_note WHERE gm.group_note = :group AND gs.subtype = :subtype")
    Flux<NoteCollab> findBySubtype(UUID subtype,UUID group);
    @Query("SELECT DISTINCT n.* FROM note AS n JOIN group_member AS gm ON gm.member = n.member WHERE gm.group_note = :groupNote AND n.subtype IS NOT NULL AND n.title LIKE '%'||:name||'%'")
    Flux<NoteCollab> findByTitleLikeAndGroupMember(String name, UUID group, Pageable pageable);
    @Query("SELECT n.* FROM note AS n JOIN member AS m ON m.id = n.member JOIN group_member AS gm ON gm.member = n.member WHERE (COALESCE(:severity) = '' OR n.severity IN (:severity)) AND (COALESCE(:subtype) = '00000000-0000-0000-0000-000000000000' OR n.subtype IN (:subtype)) AND (COALESCE(:member) = '' OR m.name = :member) AND gm.group_note = :group AND n.subtype IS NOT NULL")
    Flux<NoteCollab> findByFilterGroupMember(List<String> severity, List<UUID> subtype, String member, UUID group, Pageable pageable);
    @Query("SELECT DISTINCT n.severity FROM note AS n JOIN group_member AS gm ON gm.member = n.member WHERE gm.group_note = :group AND severity IS NOT NULL")
    Flux<Severity> findSeverityByGroup(UUID group);
    @Modifying
    @Query("UPDATE note AS n SET n.subtype = :newSubtype FROM note AS nt JOIN group_member AS gm ON gm.member = nt.member JOIN group_subtype AS gs ON gm.group_note = gs.group_note WHERE gm.group_note = :group AND gs.subtype = :oldSubtype AND n.id = nt.id")
    Mono<Void> updateSubtypeGroup(UUID group, UUID oldSubtype, UUID newSubtype);
    @Modifying
    @Query("DELETE FROM note AS n JOIN group_member AS gm ON gm.member = n.member JOIN group_subtype AS gs ON gm.group_note = gs.group_note WHERE gm.group_note = :group AND gs.subtype = :subtype")
    Mono<Void> deleteByGroupAndSubtype(UUID group, UUID subtype);
    @Modifying
    @Query("DELETE FROM note AS n JOIN group_member AS gm ON gm.member = n.member JOIN group_subtype AS gs ON gm.group_note = gs.group_note WHERE gm.group_note = :group")
    Mono<Void> deleteByGroup(UUID group);
    @Override
    <S extends NoteCollab> Mono<S> save(S entity);
}
