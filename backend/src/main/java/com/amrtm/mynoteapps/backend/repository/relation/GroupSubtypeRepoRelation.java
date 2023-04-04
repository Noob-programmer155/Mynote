package com.amrtm.mynoteapps.backend.repository.relation;

import com.amrtm.mynoteapps.backend.model.relation.GroupSubtypeRel;
import com.amrtm.mynoteapps.backend.repository.MyNoteStoreRepoRelation;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface GroupSubtypeRepoRelation extends MyNoteStoreRepoRelation<UUID,GroupSubtypeRel>, ReactiveCrudRepository<GroupSubtypeRel,Long> {
    @Query("SELECT * FROM group_subtype WHERE group_note = :parent")
    Flux<GroupSubtypeRel> findByParent(UUID parent);
    @Transactional
    @Modifying
    @Query("DELETE FROM group_subtype WHERE group_note = :parent AND subtype = :child")
    Mono<Void> deleteByParentAndChild(UUID parent, UUID child);

    @Transactional
    @Override
    <S extends GroupSubtypeRel> Mono<S> save(S entity);
}
