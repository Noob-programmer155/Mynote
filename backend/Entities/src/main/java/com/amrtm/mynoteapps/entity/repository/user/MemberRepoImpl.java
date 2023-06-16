package com.amrtm.mynoteapps.entity.repository.user;

import com.amrtm.mynoteapps.entity.other.obj.MemberNotif;
import com.amrtm.mynoteapps.entity.other.obj.Name;
import com.amrtm.mynoteapps.entity.user.member.impl.Member;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface MemberRepoImpl<E extends Member,PagingAndSorting> extends UserRepo<E, UUID, PagingAndSorting> {
    Mono<E> findByName(String name);
    Flux<E> findByNameLike(String name, PagingAndSorting pageable);
    Flux<MemberNotif> findByWaitingState(UUID group, PagingAndSorting pageable);
    Flux<MemberNotif> findByRejectState(UUID group, PagingAndSorting pageable);
    Flux<E> findMemberGroup(UUID group);
    Mono<Name> validateName(String username);
    @Override
    <S extends E> Mono<S> save(S entity);
}
