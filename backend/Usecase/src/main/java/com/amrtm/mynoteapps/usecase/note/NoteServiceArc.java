package com.amrtm.mynoteapps.usecase.note;

import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.entity.other.obj.Category;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public interface NoteServiceArc {
    Flux<NotePrivateDTO> findByTitleMember(String title, Pageable pageable);
    Flux<Category> getCategoryMember();
    Flux<NoteCollabDTO> findBySubtype(UUID subtype,UUID group);
    Flux<NoteCollabDTO> findByTitleGroup(UUID group, String title, Pageable pageable);
    Flux<NotePrivateDTO> filterMember(List<String> category, List<String> severity, Pageable pageable);
    Flux<NoteCollabDTO> filterGroup(List<String> severity,List<UUID> subtypes, String member, UUID group, Pageable pageable);
    Mono<NoteCollabDTO> saveNoteCollab(NoteCollabDTO data, UUID group, boolean isUpdate);
    Mono<NotePrivateDTO> saveNotePrivate(NotePrivateDTO data, boolean isUpdate);
    Mono<Void> deleteNoteCollab(UUID id, UUID group);
    Mono<Void> deleteNotePrivate(UUID id);
    Mono<Void> deleteNoteByCategory(String category);
}
