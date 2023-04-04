package com.amrtm.mynoteapps.backend.repository.relation;

import com.amrtm.mynoteapps.backend.model.relation.GroupMemberRel;
import com.amrtm.mynoteapps.backend.repository.MyNoteStoreRepoRelation;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface GroupMemberRepoRelation extends MyNoteStoreRepoRelation<UUID,GroupMemberRel>, ReactiveCrudRepository<GroupMemberRel,Long> {
    @Query("SELECT * FROM group_member WHERE group_note = :parent AND member = :child AND isConfirmed = 1 AND isDeleted = 0")
    Mono<GroupMemberRel> findByParentAndChild(UUID parent, UUID child);
    @Query("SELECT * FROM group_member WHERE group_note = :parent AND member = :child AND isConfirmed = 0 AND isDeleted = 0")
    Mono<GroupMemberRel> findByParentAndChildNonAuthorize(UUID parent, UUID child);
    @Transactional
    @Modifying
    @Query("DELETE FROM group_member WHERE group_note = :parent AND member = :child AND isConfirmed = 1 AND isDeleted = 0")
    Mono<Void> deleteByParentAndChildAuth(UUID parent, UUID child);
    @Transactional
    @Modifying
    @Query("DELETE FROM group_member WHERE group_note = :parent AND member = :child")
    Mono<Void> deleteByParentAndChild(UUID parent, UUID child);

    @Transactional
    @Override
    <S extends GroupMemberRel> Mono<S> save(S entity);
}
