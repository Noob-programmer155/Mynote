package com.amrtm.mynoteapps.backend.repository.theme;

import com.amrtm.mynoteapps.backend.model.theme.impl.Theme;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface ThemeRepoImpl extends ThemeRepo<Theme, UUID>, ReactiveCrudRepository<Theme,UUID>, ReactiveSortingRepository<Theme,UUID> {
    @Query("SELECT t.* FROM theme AS t JOIN theme_member AS tm ON t.id = tm.theme WHERE tm.member = :member AND tm.isActive = 1")
    Mono<Theme> findByIdMemberActive(UUID member);

    @Query("SELECT t.* FROM theme AS t JOIN theme_member AS tm ON t.id = tm.theme WHERE tm.member = :member AND tm.isActive = 0 AND t.name LIKE '%'||:name||'%'")
    Flux<Theme> findByNameLikeAndMember(String name, UUID member, Pageable pageable);

    @Query("SELECT * FROM theme WHERE name LIKE '%'||:name||'%'")
    Flux<Theme> findByNameLike(String name, Pageable pageable);

    @Transactional
    @Override
    <S extends Theme> Mono<S> save(S entity);
}
