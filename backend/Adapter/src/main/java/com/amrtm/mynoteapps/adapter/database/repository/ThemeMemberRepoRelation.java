package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.entity.relation.ThemeMemberRel;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface ThemeMemberRepoRelation extends MyNoteStoreRepoRelation<UUID,ThemeMemberRel>, ReactiveCrudRepository<ThemeMemberRel,UUID> {
    @Query("SELECT * FROM theme_member WHERE theme = :parent AND member = :child")
    Mono<ThemeMemberRel> findByParentAndChild(UUID parent, UUID child);
    @Modifying
    @Query("DELETE FROM theme_member WHERE theme = :parent AND member = :child")
    Mono<Void> deleteByParentAndChild(UUID parent, UUID child);
    @Query("SELECT * FROM theme_member WHERE member = :member AND isActive = 1")
    Mono<ThemeMemberRel> findByActiveState(UUID member);
    @Override
    <S extends ThemeMemberRel> Mono<S> save(S entity);
}