package com.amrtm.mynoteapps.entity.repository.relation;

import com.amrtm.mynoteapps.entity.relation.GroupSubtypeRel;
import com.amrtm.mynoteapps.entity.repository.MyNoteStoreRepoRelation;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

import java.util.UUID;

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
