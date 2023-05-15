package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.adapter.converter.NotePrivatePersisConv;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivate;
import com.amrtm.mynoteapps.entity.other.obj.Category;
import com.amrtm.mynoteapps.entity.other.obj.Severity;
import com.amrtm.mynoteapps.entity.repository.note.NotePrivateRepo;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public class NotePrivateRepoAdapter implements NotePrivateRepo<NotePrivate, Pageable> {
    private final com.amrtm.mynoteapps.adapter.database.persistence.repository.note.NotePrivateRepo notePrivateRepo;
    private final NotePrivatePersisConv notePrivatePersisConv = new NotePrivatePersisConv();
    public NotePrivateRepoAdapter(com.amrtm.mynoteapps.adapter.database.persistence.repository.note.NotePrivateRepo notePrivateRepo) {
        this.notePrivateRepo = notePrivateRepo;
    }

    @Override
    public Mono<NotePrivate> findById(UUID uuid) {
        return notePrivateRepo.findById(uuid).map(notePrivatePersisConv::toSecond);
    }

    @Override
    public Mono<Void> deleteById(UUID uuid) {
        return notePrivateRepo.deleteById(uuid);
    }

    @Override
    public Flux<NotePrivate> findByTitleLike(String name, UUID member, Pageable pageable) {
        return notePrivateRepo.findByTitleLike(name, member, pageable).map(notePrivatePersisConv::toSecond);
    }

    @Override
    public Flux<Category> findCategoryByMember(UUID member) {
        return notePrivateRepo.findCategoryByMember(member);
    }

    @Override
    public Flux<Severity> findSeverityByMember(UUID member) {
        return notePrivateRepo.findSeverityByMember(member);
    }

    @Override
    public Flux<NotePrivate> findByFilter(List<String> category, List<String> severity, UUID member, Pageable pageable) {
        return notePrivateRepo.findByFilter(category, severity, member, pageable).map(notePrivatePersisConv::toSecond);
    }

    @Override
    public <S extends NotePrivate> Mono<S> save(S entity) {
        return (Mono<S>) notePrivateRepo.save(notePrivatePersisConv.toFirst(entity)).map(notePrivatePersisConv::toSecond);
    }

    @Override
    public Mono<Void> deleteByCategory(String category, UUID member) {
        return notePrivateRepo.deleteByCategory(category, member);
    }
}

