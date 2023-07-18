package com.amrtm.mynoteapps.adapter.database.persistence.repository.relation;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation.SubtypeNoteRel;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface SubtypeNoteRepoRelation extends ReactiveCrudRepository<SubtypeNoteRel,Long> {
    @Modifying
    @Query("DELETE FROM subtype_note_group WHERE subtype_group = :parent AND note = :child")
    Mono<Void> deleteByParentAndChild(@Param("parent") Long parent, @Param("child") UUID child);
    @Override
    <S extends SubtypeNoteRel> Mono<S> save(S entity);
}
