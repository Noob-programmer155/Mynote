package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.entity.relation.GroupSubtypeRel;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface GroupSubtypeRepoRelation extends MyNoteStoreRepoRelation<UUID,GroupSubtypeRel>, ReactiveCrudRepository<GroupSubtypeRel,Long> {
    @Modifying
    @Query("UPDATE group_subtype SET index = :index WHERE group_note = :parent AND subtype = :child")
    Mono<Void> updateIndex(Integer index, UUID parent, UUID child);
    @Modifying
    @Query("DELETE FROM group_subtype WHERE group_note = :parent AND subtype = :child")
    Mono<Void> deleteByParentAndChild(UUID parent, UUID child);
    @Override
    <S extends GroupSubtypeRel> Mono<S> save(S entity);
}
