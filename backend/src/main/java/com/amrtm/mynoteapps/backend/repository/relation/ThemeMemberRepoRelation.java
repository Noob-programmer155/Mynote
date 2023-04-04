package com.amrtm.mynoteapps.backend.repository.relation;

import com.amrtm.mynoteapps.backend.model.relation.ThemeMemberRel;
import com.amrtm.mynoteapps.backend.repository.MyNoteStoreRepoRelation;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface ThemeMemberRepoRelation extends MyNoteStoreRepoRelation<UUID,ThemeMemberRel>, ReactiveCrudRepository<ThemeMemberRel,UUID> {
    @Query("SELECT * FROM theme_member WHERE theme = :parent AND member = :child")
    Mono<ThemeMemberRel> findByParentAndChild(UUID parent, UUID child);
    @Transactional
    @Modifying
    @Query("DELETE FROM theme_member WHERE theme = :parent AND member = :child")
    Mono<Void> deleteByParentAndChild(UUID parent, UUID child);

    @Transactional
    @Override
    <S extends ThemeMemberRel> Mono<S> save(S entity);
}
