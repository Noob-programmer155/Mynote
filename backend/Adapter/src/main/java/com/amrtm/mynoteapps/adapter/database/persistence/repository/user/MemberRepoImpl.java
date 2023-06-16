package com.amrtm.mynoteapps.adapter.database.persistence.repository.user;

import com.amrtm.mynoteapps.entity.other.obj.MemberNotif;
import com.amrtm.mynoteapps.entity.other.obj.Name;
import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.user.Member;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface MemberRepoImpl extends ReactiveCrudRepository<Member,UUID>, ReactiveSortingRepository<Member,UUID> {
    @Query("SELECT * FROM member WHERE name = :name")
    Mono<Member> findByName(String name);
    @Query("SELECT * FROM member WHERE name LIKE '%'||:name||'%'")
    Flux<Member> findByNameLike(String name, Pageable pageable);
    @Query("SELECT m.id AS id,m.name AS name,m.password AS password,m.avatar AS avatar,gm.userFrom AS userFrom FROM member AS m JOIN group_member AS gm ON m.id = gm.member WHERE gm.group_note = :group AND gm.isDeleted = 0 AND gm.isConfirmed = 0")
    Flux<MemberNotif> findByWaitingState(UUID group, Pageable pageable);
    @Query("SELECT m.id AS id,m.name AS name,m.password AS password,m.avatar AS avatar,gm.userFrom AS userFrom FROM member AS m JOIN group_member AS gm ON m.id = gm.member WHERE gm.group_note = :group AND gm.isDeleted = 1")
    Flux<MemberNotif> findByRejectState(UUID group, Pageable pageable);
    @Query("SELECT m.* FROM member AS m JOIN group_member AS gm ON m.id = gm.member WHERE gm.group_note = :group AND gm.isDeleted = 0 AND gm.isConfirmed = 1")
    Flux<Member> findMemberGroup(UUID group);
    @Query("SELECT name FROM member WHERE name = :username")
    Mono<Name> validateName(String username);
    @Override
    <S extends Member> Mono<S> save(S entity);
}
