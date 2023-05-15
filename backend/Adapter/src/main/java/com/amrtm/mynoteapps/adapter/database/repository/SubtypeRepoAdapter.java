package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.adapter.converter.SubtypePersisConv;
import com.amrtm.mynoteapps.entity.other.bind.SubtypeColorBinding;
import com.amrtm.mynoteapps.entity.repository.subtype.SubtypeRepoImpl;
import com.amrtm.mynoteapps.entity.subtype.impl.Subtype;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public class SubtypeRepoAdapter implements SubtypeRepoImpl<Subtype, Pageable> {
    private final com.amrtm.mynoteapps.adapter.database.persistence.repository.subtype.SubtypeRepoImpl subtypeRepo;
    private final SubtypePersisConv subtypePersisConv = new SubtypePersisConv();
    public SubtypeRepoAdapter(com.amrtm.mynoteapps.adapter.database.persistence.repository.subtype.SubtypeRepoImpl subtypeRepo) {
        this.subtypeRepo = subtypeRepo;
    }

    @Override
    public Mono<Subtype> findById(UUID uuid) {
        return subtypeRepo.findById(uuid).map(subtypePersisConv::toSecond);
    }

    @Override
    public Mono<Void> deleteById(UUID uuid) {
        return subtypeRepo.deleteById(uuid);
    }

    @Override
    public Mono<Subtype> findByName(String name) {
        return subtypeRepo.findByName(name).map(subtypePersisConv::toSecond);
    }

    @Override
    public Flux<Subtype> findByNameLike(String name, Pageable pageable) {
        return subtypeRepo.findByNameLike(name, pageable).map(subtypePersisConv::toSecond);
    }

    @Override
    public Flux<SubtypeColorBinding> findByGroup(UUID group) {
        return subtypeRepo.findByGroup(group);
    }

    @Override
    public <S extends Subtype> Mono<S> save(S entities) {
        return (Mono<S>) subtypeRepo.save(subtypePersisConv.toFirst(entities)).map(subtypePersisConv::toSecond);
    }

    @Override
    public Mono<Void> deleteAllById(Iterable<? extends UUID> uuids) {
        return subtypeRepo.deleteAllById(uuids);
    }
}
