package com.amrtm.mynoteapps.adapter.database.persistence.repository.relation;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation.GroupMemberRel;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface GroupMemberRepoRelation extends ReactiveCrudRepository<GroupMemberRel,Long> {
    @Query("SELECT * FROM group_member WHERE group_note = :parent AND member = :child AND isConfirmed = 1 AND isDeleted = 0")
    Mono<GroupMemberRel> findByParentAndChild(@Param("parent") UUID parent, @Param("child") UUID child);
    @Query("SELECT * FROM group_member WHERE group_note = :parent AND member = :child AND isConfirmed = 0 AND isDeleted = 0")
    Mono<GroupMemberRel> findByParentAndChildNonAuthorize(@Param("parent") UUID parent, @Param("child") UUID child);
    @Modifying
    @Query("DELETE FROM group_member WHERE group_note = :parent AND member = :child AND isConfirmed = 1 AND isDeleted = 0")
    Mono<Void> deleteByParentAndChildAuth(@Param("parent") UUID parent, @Param("child") UUID child);
    @Modifying
    @Query("DELETE FROM group_member WHERE group_note = :parent AND member = :child")
    Mono<Void> deleteByParentAndChild(@Param("parent") UUID parent, @Param("child") UUID child);
    @Override
    <S extends GroupMemberRel> Mono<S> save(S entity);
}
