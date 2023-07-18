package com.amrtm.mynoteapps.adapter.database.persistence.repository.user;

import com.amrtm.mynoteapps.entity.other.obj.GroupNotif;
import com.amrtm.mynoteapps.entity.other.obj.Name;
import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.user.GroupNote;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface GroupRepoImpl extends ReactiveCrudRepository<GroupNote,UUID>, ReactiveSortingRepository<GroupNote,UUID> {
    Mono<GroupNote> findById(UUID uuid);
    @Query("SELECT gn.* FROM group_note AS gn JOIN group_member AS gm ON gn.id = gm.group_note WHERE gm.member = :member AND gm.isDeleted = 0 AND gm.isConfirmed = 1")
    Flux<GroupNote> findByIdMember(@Param("member") UUID member);
    @Query("SELECT * FROM group_note WHERE name LIKE '%'||:name||'%' ORDER BY name ASC OFFSET :#{#pageable.getPageNumber() * #pageable.getPageSize()} LIMIT :#{#pageable.getPageSize()}")
    Flux<GroupNote> findByNameLike(@Param("name") String name, @Param("pageable") Pageable pageable);
    @Query("SELECT gn.id AS id,gn.name AS name,gn.avatar AS avatar,gm.userFrom AS userFrom FROM group_note AS gn JOIN group_member AS gm ON gn.id = gm.group_note WHERE gm.member = :member AND gm.isDeleted = 1 " +
            "ORDER BY gn.name ASC OFFSET :#{#pageable.getPageNumber() * #pageable.getPageSize()} LIMIT :#{#pageable.getPageSize()}")
    Flux<GroupNotif> findByRejectState(@Param("member") UUID member, @Param("pageable") Pageable pageable);
    @Query("SELECT gn.id AS id,gn.name AS name,gn.avatar AS avatar,gm.userFrom AS userFrom FROM group_note AS gn JOIN group_member AS gm ON gn.id = gm.group_note WHERE gm.member = :member AND gm.isDeleted = 0 AND gm.isConfirmed = 0 " +
            "ORDER BY gn.name ASC OFFSET :#{#pageable.getPageNumber() * #pageable.getPageSize()} LIMIT :#{#pageable.getPageSize()}")
    Flux<GroupNotif> findByWaitingState(@Param("member") UUID member, @Param("pageable") Pageable pageable);
    @Query("SELECT name FROM group_note WHERE name = :name")
    Mono<Name> validateName(@Param("name") String name);
    @Override
    <S extends GroupNote> Mono<S> save(S entity);
}
