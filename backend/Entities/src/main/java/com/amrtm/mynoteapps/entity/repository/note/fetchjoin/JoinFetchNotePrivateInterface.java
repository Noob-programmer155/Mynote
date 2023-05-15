package com.amrtm.mynoteapps.entity.repository.note.fetchjoin;

import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivateDTO;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;

public interface JoinFetchNotePrivateInterface<PagingAndSorting> {
    Flux<NotePrivateDTO> findByFilterPrivate(List<String> category, List<String> severity, UUID member, PagingAndSorting pageable);
}
