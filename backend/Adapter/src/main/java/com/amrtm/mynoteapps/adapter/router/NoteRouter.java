package com.amrtm.mynoteapps.adapter.router;

import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.other.utils.SingleData;
import com.amrtm.mynoteapps.usecase.note.NoteService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public class NoteRouter {
    private final NoteService noteService;
    private final String initUUID;
    private final com.amrtm.mynoteapps.adapter.router.routerfunc.pagingandsorting.PagingAndSorting pagingAndSorting;

    public NoteRouter(NoteService noteService, String initUUID, com.amrtm.mynoteapps.adapter.router.routerfunc.pagingandsorting.PagingAndSorting pagingAndSorting) {
        this.noteService = noteService;
        this.initUUID = initUUID;
        this.pagingAndSorting = pagingAndSorting;
    }

    public Flux<NotePrivateDTO> searchByTitleInMember(String name, int page, int size) {
        return noteService.findByTitleMember(name, pagingAndSorting.create(page,size, new Pair<>(pagingAndSorting.asc(),"category"),new Pair<>(pagingAndSorting.desc(),"lastModifiedDate")));
    }

    public Flux<NoteCollabDTO> searchByTitleInGroup(UUID group, String name, int page, int size) {
        return noteService.findByTitleGroup(group,name, pagingAndSorting.create(page,size,pagingAndSorting.desc(),"lastModifiedDate"));
    }

    public Flux<SingleData<String>> getCategoryMember() {
        return noteService.getCategoryMember().map(category -> new SingleData<>(category.getCategory()));
    }

    public Flux<NoteCollabDTO> getSubtypeGroup(UUID group,UUID subtype) {
        return noteService.findBySubtype(subtype,group);
    }

    public Flux<NotePrivateDTO> filterMember(List<String> categories, List<String> severities, int page, int size) {
        return noteService.filterMember(categories,severities,pagingAndSorting.create(page,size,pagingAndSorting.desc(),"lastModifiedDate"));
    }

    public Flux<NoteCollabDTO> filterGroup(UUID group, List<String> severities, List<UUID> subtypes, String member, int page, int size) {
        return noteService.filterGroup(severities,subtypes,member,group,pagingAndSorting.create(page,size,pagingAndSorting.desc(),"lastModifiedDate"));
    }

    public Flux<SingleData<String>> getSeverityNotePrivate() {
        return noteService.getSeverityMember().map(data -> new SingleData<>(data.getSeverity()));
    }

    public Flux<SingleData<String>> getSeverityNoteCollab(UUID group) {
        return noteService.getSeverityGroup(group).map(data -> new SingleData<>(data.getSeverity()));
    }

    public Mono<NotePrivateDTO> saveNotePrivate(NotePrivateDTO notePrivateDTO) {
        return noteService.saveNotePrivate(notePrivateDTO,false);
    }

    public Mono<NoteCollabDTO> saveNoteCollab(UUID group,NoteCollabDTO noteCollabDTO) {
        return noteService.saveNoteCollab(noteCollabDTO,group,false);
    }

    public Mono<NotePrivateDTO> updateNotePrivate(NotePrivateDTO notePrivateDTO) {
        return noteService.saveNotePrivate(notePrivateDTO,true);
    }

    public Mono<NoteCollabDTO> updateNoteCollab(UUID group,NoteCollabDTO noteCollabDTO) {
        return noteService.saveNoteCollab(noteCollabDTO,group,true);
    }

    public Mono<SingleData<Boolean>> deleteNotePrivate(UUID note) {
        return noteService.deleteNotePrivate(note).then(Mono.just(new SingleData<>(true)));
    }

    public Mono<SingleData<Boolean>> deleteNoteCollab(UUID group,UUID note) {
        return noteService.deleteNoteCollab(note,group).then(Mono.just(new SingleData<>(true)));
    }

    public Mono<SingleData<Boolean>> deleteNotePrivateByCategory(String category) {
        return noteService.deleteNoteByCategory(category).then(Mono.just(new SingleData<>(true)));
    }
}
