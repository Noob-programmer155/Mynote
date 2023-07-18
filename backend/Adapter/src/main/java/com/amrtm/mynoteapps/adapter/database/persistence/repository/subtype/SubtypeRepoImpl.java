package com.amrtm.mynoteapps.adapter.database.persistence.repository.subtype;

import com.amrtm.mynoteapps.entity.other.bind.SubtypeColorBinding;
import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.subtype.Subtype;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface SubtypeRepoImpl extends ReactiveCrudRepository<Subtype,UUID>, ReactiveSortingRepository<Subtype,UUID> {
    @Query("SELECT * FROM subtype WHERE name = :name")
    Mono<Subtype> findByName(@Param("name") String name);
    @Query("SELECT * FROM subtype WHERE name LIKE '%'||:name||'%' ORDER BY name ASC OFFSET :#{#pageable.getPageNumber() * #pageable.getPageSize()} LIMIT :#{#pageable.getPageSize()}")
    Flux<Subtype> findByNameLike(@Param("name") String name, @Param("pageable") Pageable pageable);
    @Query("SELECT s.id AS id,s.name AS name,gs.color AS color FROM group_subtype AS gs JOIN subtype AS s ON gs.subtype = s.id WHERE gs.group_note = :group ORDER BY gs.index ASC")
    Flux<SubtypeColorBinding> findByGroup(@Param("group") UUID group);
    @Override
    <S extends Subtype> Mono<S> save(S entities);
    @Override
    Mono<Void> deleteAllById(Iterable<? extends UUID> uuids);
}
