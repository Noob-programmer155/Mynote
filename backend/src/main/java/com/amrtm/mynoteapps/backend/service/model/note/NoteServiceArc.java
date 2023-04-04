package com.amrtm.mynoteapps.backend.service.model.note;

import com.amrtm.mynoteapps.backend.model.note.NoteDTOInterface;
import com.amrtm.mynoteapps.backend.model.note.NoteEntity;
import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.backend.model.note.private_note.impl.NotePrivate;
import com.amrtm.mynoteapps.backend.model.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.backend.service.other.UUIDIdAndName;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public interface NoteServiceArc {
    Flux<NotePrivateDTO> findByTitleMember(String title, Pageable pageable);
    Flux<NoteCollabDTO> findByTitleGroup(UUID member, UUID group, String name, Pageable pageable);
    Flux<NotePrivateDTO> filterMember(List<String> category, List<String> severity, Pageable pageable);
    Flux<NoteCollabDTO> filterGroup(List<String> severity,List<UUID> subtypes, UUID member, UUID group, Pageable pageable);
    Mono<NoteCollabDTO> saveNoteCollab(NoteCollabDTO data, UUID group, boolean isUpdate);
    Mono<NotePrivateDTO> saveNotePrivate(NotePrivateDTO data, boolean isUpdate);
    Mono<Void> deleteNoteCollab(UUID id, UUID group);
    Mono<Void> deleteNotePrivate(UUID id);
}
