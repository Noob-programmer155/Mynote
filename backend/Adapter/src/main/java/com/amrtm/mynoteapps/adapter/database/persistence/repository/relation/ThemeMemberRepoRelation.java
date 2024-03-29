package com.amrtm.mynoteapps.adapter.database.persistence.repository.relation;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation.ThemeMemberRel;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface ThemeMemberRepoRelation extends ReactiveCrudRepository<ThemeMemberRel,UUID> {
    @Query("SELECT * FROM theme_member WHERE theme = :parent AND member = :child")
    Mono<ThemeMemberRel> findByParentAndChild(@Param("parent") UUID parent, @Param("child") UUID child);
    @Modifying
    @Query("DELETE FROM theme_member WHERE theme = :parent AND member = :child")
    Mono<Void> deleteByParentAndChild(@Param("parent") UUID parent, @Param("child") UUID child);
    @Query("SELECT * FROM theme_member WHERE member = :member AND isActive = 1")
    Mono<ThemeMemberRel> findByActiveState(@Param("member") UUID member);
    @Override
    <S extends ThemeMemberRel> Mono<S> save(S entity);
}
