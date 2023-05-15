package com.amrtm.mynoteapps.entity.repository.note.fetchjoin;

import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollabDTO;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;

public interface JoinFetchNoteCollabInterface<PagingAndSorting> {
    Flux<NoteCollabDTO> findBySubtype(UUID subtype, UUID group);
    Flux<NoteCollabDTO> findByTitleLikeAndGroup(String name, UUID group, PagingAndSorting pageable);
    Flux<NoteCollabDTO> findByFilterGroupMember(List<String> severity, List<UUID> subtype, String member, UUID group, PagingAndSorting pageable);
}
