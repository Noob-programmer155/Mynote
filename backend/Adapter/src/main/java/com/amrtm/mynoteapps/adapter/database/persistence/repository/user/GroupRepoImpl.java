package com.amrtm.mynoteapps.adapter.database.persistence.repository.user;

import com.amrtm.mynoteapps.entity.other.obj.Name;
import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.user.GroupNote;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface GroupRepoImpl extends ReactiveCrudRepository<GroupNote,UUID>, ReactiveSortingRepository<GroupNote,UUID> {
    Mono<GroupNote> findById(UUID uuid);
    @Query("SELECT gn.* FROM group_note AS gn JOIN group_member AS gm ON gn.id = gm.group_note WHERE gm.member = :member AND gm.isDeleted = 0 AND gm.isConfirmed = 1")
    Flux<GroupNote> findByIdMember(UUID member);
    @Query("SELECT * FROM group_note WHERE name LIKE '%'||:name||'%'")
    Flux<GroupNote> findByNameLike(String name, Pageable pageable);
    @Query("SELECT gn.* FROM group_note AS gn JOIN group_member AS gm ON gn.id = gm.group_note WHERE gm.member = :member AND gm.isDeleted = 1")
    Flux<GroupNote> findByRejectState(UUID member,Pageable pageable);
    @Query("SELECT gn.* FROM group_note AS gn JOIN group_member AS gm ON gn.id = gm.group_note WHERE gm.member = :member AND gm.isDeleted = 0 AND gm.isConfirmed = 0")
    Flux<GroupNote> findByWaitingState(UUID member,Pageable pageable);
    @Query("SELECT name FROM group_note WHERE name = :name")
    Mono<Name> validateName(String name);
    @Override
    <S extends GroupNote> Mono<S> save(S entity);
}
