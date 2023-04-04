package com.amrtm.mynoteapps.backend.repository.note.fetchjoin;

import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollabDTO;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;

public interface JoinFetchNoteCollabInterface {
    Flux<NoteCollabDTO> findByTitleLikeAndGroupMember(String name, UUID member, UUID group, Pageable pageable);
    Flux<NoteCollabDTO> findByFilterGroupMember(List<String> severity, List<UUID> subtype, UUID member, UUID group, Pageable pageable);
}
