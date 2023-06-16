package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.adapter.converter.NoteCollabPersisConv;
import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.entity.other.obj.Severity;
import com.amrtm.mynoteapps.entity.repository.note.NoteCollabRepo;
import org.springframework.data.domain.Pageable;
import org.springframework.r2dbc.BadSqlGrammarException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public class NoteCollabRepoAdapter implements NoteCollabRepo<NoteCollab, Pageable> {
    private final com.amrtm.mynoteapps.adapter.database.persistence.repository.note.NoteCollabRepo noteCollabRepo;
    private final NoteCollabPersisConv noteCollabPersisConv = new NoteCollabPersisConv();
    public NoteCollabRepoAdapter(com.amrtm.mynoteapps.adapter.database.persistence.repository.note.NoteCollabRepo noteCollabRepo) {
        this.noteCollabRepo = noteCollabRepo;
    }

    @Override
    public Mono<NoteCollab> findById(UUID uuid) {
        return noteCollabRepo.findById(uuid).map(noteCollabPersisConv::toSecond);
    }

    @Override
    public Mono<Void> deleteById(UUID uuid) {
        return noteCollabRepo.deleteById(uuid);
    }

    @Override
    public Flux<NoteCollab> findBySubtype(UUID subtype, UUID group) {
        return noteCollabRepo.findBySubtype(subtype, group).map(noteCollabPersisConv::toSecond);
    }

    @Override
    public Flux<NoteCollab> findByTitleLikeAndGroupMember(String name, UUID group, Pageable pageable) {
        return noteCollabRepo.findByTitleLikeAndGroupMember(name, group, pageable).map(noteCollabPersisConv::toSecond);
    }

    @Override
    public Flux<NoteCollab> findByFilterGroupMember(List<String> severity, List<UUID> subtype, String member, UUID group, Pageable pageable) {
        return noteCollabRepo.findByFilterGroupMember(severity, subtype, member, group, pageable).map(noteCollabPersisConv::toSecond);
    }

    @Override
    public Flux<Severity> findSeverityByGroup(UUID group) {
        return noteCollabRepo.findSeverityByGroup(group);
    }

    @Override
    public Mono<Void> updateSubtypeGroup(UUID group, UUID oldSubtype, UUID newSubtype) {
        return noteCollabRepo.updateSubtypeGroup(group, oldSubtype, newSubtype).onErrorResume(BadSqlGrammarException.class,e -> Mono.empty());
    }

    @Override
    public Mono<Void> deleteByGroupAndSubtype(UUID group, UUID subtype) {
        return noteCollabRepo.deleteByGroupAndSubtype(group, subtype);
    }

    @Override
    public Mono<Void> deleteByGroup(UUID group) {
        return noteCollabRepo.deleteByGroup(group);
    }

    @Override
    public <S extends NoteCollab> Mono<S> save(S entity) {
        return (Mono<S>) noteCollabRepo.save(noteCollabPersisConv.toFirst(entity)).map(noteCollabPersisConv::toSecond);
    }
}
