package com.amrtm.mynoteapps.adapter.database.persistence.repository.note;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.note.NoteCollab;
import com.amrtm.mynoteapps.entity.other.obj.Severity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public interface NoteCollabRepo extends ReactiveCrudRepository<NoteCollab, UUID>, ReactiveSortingRepository<NoteCollab, UUID> {
    @Query("SELECT DISTINCT n.* FROM subtype_note_group AS sng JOIN note AS n ON sng.note = n.id JOIN group_subtype AS gs ON sng.subtype_group = gs.id WHERE gs.group_note = :group AND gs.subtype = :subtype")
    Flux<NoteCollab> findBySubtype(@Param("subtype") UUID subtype, @Param("group") UUID group);
//    INNER JOIN group_subtype AS gs ON n.subtype = gs.subtypeItem
    @Query("SELECT DISTINCT n.* FROM subtype_note_group AS sng JOIN note AS n ON sng.note = n.id JOIN group_subtype AS gs ON sng.subtype_group = gs.id WHERE gs.group_note = :group AND n.title LIKE '%'||:name||'%' " +
            "ORDER BY n.lastModifiedDate DESC,n.title ASC OFFSET :#{#pageable.getPageNumber() * #pageable.getPageSize()} LIMIT :#{#pageable.getPageSize()}")
    Flux<NoteCollab> findByTitleLikeAndGroupMember(@Param("name") String name, @Param("group") UUID group, @Param("pageable") Pageable pageable);
    @Query("SELECT DISTINCT n.* FROM subtype_note_group AS sng JOIN note AS n ON sng.note = n.id JOIN group_subtype AS gs ON sng.subtype_group = gs.id JOIN member AS m ON n.member = m.id WHERE (COALESCE(:severity) = '' OR n.severity IN (:severity)) AND (COALESCE(:subtype) = '00000000-0000-0000-0000-000000000000' OR gs.subtype IN (:subtype)) AND (COALESCE(:member) = '' OR m.name = :member) AND gs.group_note = :group " +
            "ORDER BY n.lastModifiedDate DESC,n.title ASC OFFSET :#{#pageable.getPageNumber() * #pageable.getPageSize()} LIMIT :#{#pageable.getPageSize()}")
    Flux<NoteCollab> findByFilterGroupMember(@Param("severity") List<String> severity, @Param("subtype") List<UUID> subtype, @Param("member") String member, @Param("group") UUID group, @Param("pageable") Pageable pageable);
    @Query("SELECT DISTINCT n.severity FROM subtype_note_group AS sng JOIN note AS n ON sng.note = n.id JOIN group_subtype AS gs ON sng.subtype_group = gs.id WHERE gs.group_note = :group AND severity IS NOT NULL")
    Flux<Severity> findSeverityByGroup(@Param("group") UUID group);
    @Modifying
    @Query("UPDATE note AS n SET n.subtype = :newSubtype FROM subtype_note_group AS sng JOIN note AS nt ON sng.note = nt.id JOIN group_subtype AS gs ON sng.subtype_group = gs.id WHERE gs.group_note = :group AND gs.subtype = :oldSubtype AND n.id = nt.id")
    Mono<Void> updateSubtypeGroup(@Param("group") UUID group, @Param("oldSubtype") UUID oldSubtype, @Param("newSubtype") UUID newSubtype);
    @Modifying
    @Query("DELETE FROM note AS n WHERE n in (SELECT nt FROM subtype_note_group AS sng JOIN note AS nt ON sng.note = nt.id JOIN group_subtype AS gs ON sng.subtype_group = gs.id WHERE gs.group_note = :group AND gs.subtype = :subtype)")
    Mono<Void> deleteByGroupAndSubtype(@Param("group") UUID group, @Param("subtype") UUID subtype);
    @Modifying
    @Query("DELETE FROM note AS n WHERE n in (SELECT nt FROM subtype_note_group AS sng JOIN note AS nt ON sng.note = nt.id JOIN group_subtype AS gs ON sng.subtype_group = gs.id WHERE gs.group_note = :group)")
    Mono<Void> deleteByGroup(@Param("group") UUID group);
    @Override
    <S extends NoteCollab> Mono<S> save(S entity);
}
