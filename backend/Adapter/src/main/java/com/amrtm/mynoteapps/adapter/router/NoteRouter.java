package com.amrtm.mynoteapps.adapter.router;

import com.amrtm.mynoteapps.entity.model.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.entity.model.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.entity.other.obj.FilterNoteGroup;
import com.amrtm.mynoteapps.entity.other.obj.FilterNoteMember;
import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.other.utils.SingleData;
import com.amrtm.mynoteapps.usecase.note.NoteService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public class NoteRouter<PagingAndSorting> {
    private final NoteService<PagingAndSorting> noteService;
    private final com.amrtm.mynoteapps.entity.other.pagingandsorting.PagingAndSorting<PagingAndSorting> pagingAndSorting;
    private final String initUUID;

    public NoteRouter(NoteService<PagingAndSorting> noteService, String initUUID, com.amrtm.mynoteapps.entity.other.pagingandsorting.PagingAndSorting<PagingAndSorting> pagingAndSorting) {
        this.noteService = noteService;
        this.pagingAndSorting = pagingAndSorting;
        this.initUUID = initUUID;
    }

    public Flux<NotePrivateDTO> searchByTitleInMember(String name, int page, int size) {
        return noteService.findByTitleMember(name, pagingAndSorting.create(page,size, Arrays.asList(new Pair<>(pagingAndSorting.asc(),"category"),new Pair<>(pagingAndSorting.desc(),"lastModifiedDate"))));
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

    public Flux<NotePrivateDTO> filterMember(FilterNoteMember filterNoteMember) {
        return noteService.filterMember(
                (filterNoteMember.getCategories() != null && filterNoteMember.getCategories().size() > 0)?filterNoteMember.getCategories():List.of(""),
                (filterNoteMember.getSeverities() != null && filterNoteMember.getSeverities().size() > 0)?filterNoteMember.getSeverities():List.of(""),
                pagingAndSorting.create(
                        (filterNoteMember.getPage() != null)?filterNoteMember.getPage():0,
                        (filterNoteMember.getSize() != null)?filterNoteMember.getSize():10,
                        pagingAndSorting.desc(),"lastModifiedDate"));
    }

    public Flux<NoteCollabDTO> filterGroup(FilterNoteGroup filterNoteGroup) {
        return noteService.filterGroup(
                (filterNoteGroup.getSeverities() != null && filterNoteGroup.getSeverities().size() > 0)?filterNoteGroup.getSeverities():List.of(""),
                (filterNoteGroup.getSubtypes() != null && filterNoteGroup.getSubtypes().size() > 0)?filterNoteGroup.getSubtypes():List.of(UUID.fromString(initUUID)),
                (filterNoteGroup.getMember() != null)?filterNoteGroup.getMember():"",
                (filterNoteGroup.getGroup() != null)?filterNoteGroup.getGroup():UUID.fromString(""),
                pagingAndSorting.create(
                        (filterNoteGroup.getPage() != null)?filterNoteGroup.getPage():0,
                        (filterNoteGroup.getSize() != null)?filterNoteGroup.getSize():10,
                        pagingAndSorting.desc(),"lastModifiedDate"));
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
