package com.amrtm.mynoteapps.entity.repository.user;

import com.amrtm.mynoteapps.entity.other.obj.GroupNotif;
import com.amrtm.mynoteapps.entity.other.obj.Name;
import com.amrtm.mynoteapps.entity.user.group.impl.GroupNote;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface GroupRepoImpl<E extends GroupNote,PagingAndSorting> extends UserRepo<E,UUID,PagingAndSorting> {
    Mono<E> findById(UUID uuid);
    Flux<E> findByIdMember(UUID member);
    Flux<E> findByNameLike(String name, PagingAndSorting pageable);
    Flux<GroupNotif> findByRejectState(UUID member,PagingAndSorting pageable);
    Flux<GroupNotif> findByWaitingState(UUID member, PagingAndSorting pageable);
    Mono<Name> validateName(String name);
    @Override
    <S extends E> Mono<S> save(S entity);
}
