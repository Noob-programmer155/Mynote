package com.amrtm.mynoteapps.adapter.database.persistence.repository.note;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.note.NotePrivate;
import com.amrtm.mynoteapps.entity.other.obj.Category;
import com.amrtm.mynoteapps.entity.other.obj.Severity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public interface NotePrivateRepo extends ReactiveCrudRepository<NotePrivate, UUID>, ReactiveSortingRepository<NotePrivate, UUID> {
    @Query("SELECT * FROM note WHERE member = :member AND title LIKE '%'||:name||'%' AND subtype IS NULL " +
            "ORDER BY category ASC,lastModifiedDate DESC,title ASC OFFSET :#{#pageable.getPageNumber() * #pageable.getPageSize()} LIMIT :#{#pageable.getPageSize()}")
    Flux<NotePrivate> findByTitleLike(@Param("name") String name, @Param("member") UUID member, @Param("pageable") Pageable pageable);
    @Query("SELECT DISTINCT category FROM note WHERE member = :member AND category IS NOT NULL")
    Flux<Category> findCategoryByMember(@Param("member") UUID member);
    @Query("SELECT DISTINCT severity FROM note WHERE member = :member AND severity IS NOT NULL AND subtype IS NULL")
    Flux<Severity> findSeverityByMember(@Param("member") UUID member);
    @Query("SELECT * FROM note WHERE (COALESCE(:severity) = '' OR severity IN (:severity)) AND (COALESCE(:category) = '' OR category IN (:category)) AND member = :member AND subtype IS NULL " +
            "ORDER BY category ASC,lastModifiedDate DESC,title ASC OFFSET :#{#pageable.getPageNumber() * #pageable.getPageSize()} LIMIT :#{#pageable.getPageSize()}")
    Flux<NotePrivate> findByFilter(@Param("category") List<String> category, @Param("severity") List<String> severity, @Param("member") UUID member, @Param("pageable") Pageable pageable);
    @Override
    <S extends NotePrivate> Mono<S> save(S entity);
    @Modifying
    @Query("UPDATE note SET category = 'uncategorized' WHERE member = :member AND category = :category")
    Mono<Void> deleteByCategory(@Param("category") String category, @Param("member") UUID member);
}
