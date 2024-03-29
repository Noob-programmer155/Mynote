package com.amrtm.mynoteapps.adapter.database.persistence.repository.relation;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation.GroupMemberRel;
import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation.GroupSubtypeRel;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface GroupSubtypeRepoRelation extends ReactiveCrudRepository<GroupSubtypeRel,Long> {
    @Query("SELECT * FROM group_subtype WHERE group_note = :parent AND subtype = :child")
    Mono<GroupSubtypeRel> findByParentAndChild(@Param("parent") UUID parent, @Param("child") UUID child);
    @Modifying
    @Query("UPDATE group_subtype SET index = :index WHERE group_note = :parent AND subtype = :child")
    Mono<Void> updateIndex(@Param("index") Integer index, @Param("parent") UUID parent, @Param("child") UUID child);
    @Modifying
    @Query("DELETE FROM group_subtype WHERE group_note = :parent AND subtype = :child")
    Mono<Void> deleteByParentAndChild(@Param("parent") UUID parent, @Param("child") UUID child);
    @Override
    <S extends GroupSubtypeRel> Mono<S> save(S entity);
}
