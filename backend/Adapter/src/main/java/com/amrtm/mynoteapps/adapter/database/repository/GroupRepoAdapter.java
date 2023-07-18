package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.adapter.converter.GroupPersisConv;
import com.amrtm.mynoteapps.entity.other.obj.GroupNotif;
import com.amrtm.mynoteapps.entity.other.obj.Name;
import com.amrtm.mynoteapps.entity.repository.user.GroupRepoImpl;
import com.amrtm.mynoteapps.entity.model.user.group.impl.GroupNote;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public class GroupRepoAdapter implements GroupRepoImpl<GroupNote, Pageable> {
    private final com.amrtm.mynoteapps.adapter.database.persistence.repository.user.GroupRepoImpl groupRepo;
    private final GroupPersisConv groupPersisConv = new GroupPersisConv();

    public GroupRepoAdapter(com.amrtm.mynoteapps.adapter.database.persistence.repository.user.GroupRepoImpl groupRepo) {
        this.groupRepo = groupRepo;
    }

    @Override
    public Mono<Void> deleteById(UUID uuid) {
        return groupRepo.deleteById(uuid);
    }

    @Override
    public Mono<GroupNote> findById(UUID uuid) {
        return groupRepo.findById(uuid).map(groupPersisConv::toSecond);
    }

    @Override
    public Flux<GroupNote> findByIdMember(UUID member) {
        return groupRepo.findByIdMember(member).map(groupPersisConv::toSecond);
    }

    @Override
    public Flux<GroupNote> findByNameLike(String name, Pageable pageable) {
        return groupRepo.findByNameLike(name, pageable).map(groupPersisConv::toSecond);
    }

    @Override
    public Flux<GroupNotif> findByRejectState(UUID member, Pageable pageable) {
        return groupRepo.findByRejectState(member, pageable);
    }

    @Override
    public Flux<GroupNotif> findByWaitingState(UUID member, Pageable pageable) {
        return groupRepo.findByWaitingState(member, pageable);
    }

    @Override
    public Mono<Name> validateName(String name) {
        return groupRepo.validateName(name);
    }

    @Override
    public <S extends GroupNote> Mono<S> save(S entity) {
        return (Mono<S>) groupRepo.save(groupPersisConv.toFirst(entity)).map(groupPersisConv::toSecond);
    }
}
