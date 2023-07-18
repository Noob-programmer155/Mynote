package com.amrtm.mynoteapps.adapter.database.persistence.repository.user;

import com.amrtm.mynoteapps.entity.other.obj.MemberNotif;
import com.amrtm.mynoteapps.entity.other.obj.Name;
import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.user.Member;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface MemberRepoImpl extends ReactiveCrudRepository<Member,UUID>, ReactiveSortingRepository<Member,UUID> {
    @Query("SELECT * FROM member WHERE name = :name")
    Mono<Member> findByName(@Param("name") String name);
    @Query("SELECT * FROM member WHERE name LIKE '%'||:name||'%' ORDER BY name ASC OFFSET :#{#pageable.getPageNumber() * #pageable.getPageSize()} LIMIT :#{#pageable.getPageSize()}")
    Flux<Member> findByNameLike(@Param("name") String name, @Param("pageable") Pageable pageable);
    @Query("SELECT m.id AS id,m.name AS name,m.password AS password,m.avatar AS avatar,gm.userFrom AS userFrom FROM member AS m JOIN group_member AS gm ON m.id = gm.member WHERE gm.group_note = :group AND gm.isDeleted = 0 AND gm.isConfirmed = 0 " +
            "ORDER BY m.name ASC OFFSET :#{#pageable.getPageNumber() * #pageable.getPageSize()} LIMIT :#{#pageable.getPageSize()}")
    Flux<MemberNotif> findByWaitingState(@Param("group") UUID group, @Param("pageable") Pageable pageable);
    @Query("SELECT m.id AS id,m.name AS name,m.password AS password,m.avatar AS avatar,gm.userFrom AS userFrom FROM member AS m JOIN group_member AS gm ON m.id = gm.member WHERE gm.group_note = :group AND gm.isDeleted = 1 " +
            "ORDER BY m.name ASC OFFSET :#{#pageable.getPageNumber() * #pageable.getPageSize()} LIMIT :#{#pageable.getPageSize()}")
    Flux<MemberNotif> findByRejectState(@Param("group") UUID group, @Param("pageable") Pageable pageable);
    @Query("SELECT m.* FROM member AS m JOIN group_member AS gm ON m.id = gm.member WHERE gm.group_note = :group AND gm.isDeleted = 0 AND gm.isConfirmed = 1")
    Flux<Member> findMemberGroup(@Param("group") UUID group);
    @Query("SELECT name FROM member WHERE name = :username")
    Mono<Name> validateName(@Param("username") String username);
    @Override
    <S extends Member> Mono<S> save(S entity);
}
