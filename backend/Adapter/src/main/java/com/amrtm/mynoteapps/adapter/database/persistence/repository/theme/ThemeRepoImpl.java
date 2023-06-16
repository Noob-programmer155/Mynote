package com.amrtm.mynoteapps.adapter.database.persistence.repository.theme;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.theme.Theme;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface ThemeRepoImpl extends ReactiveCrudRepository<Theme,UUID>, ReactiveSortingRepository<Theme,UUID> {
    Mono<Theme> findByName(String name);
    @Query("SELECT t.* FROM theme AS t JOIN theme_member AS tm ON t.id = tm.theme WHERE tm.member = :member AND tm.isActive = 1")
    Mono<Theme> findByIdMemberActive(UUID member);
    @Query("SELECT t.* FROM theme AS t JOIN theme_member AS tm ON t.id = tm.theme WHERE tm.member = :member AND tm.isActive = 0 AND t.name LIKE '%'||:name||'%'")
    Flux<Theme> findByNameLikeAndMember(String name, UUID member, Pageable pageable);
    @Query("SELECT th.* FROM theme AS th WHERE th.id NOT IN (SELECT DISTINCT t.id FROM theme AS t JOIN theme_member AS tm ON t.id = tm.theme WHERE tm.member = :member) AND th.name LIKE '%'||:name||'%'")
    Flux<Theme> findByNameLike(String name, @Param("member") UUID member, Pageable pageable);
    @Override
    <S extends Theme> Mono<S> save(S entity);
}
