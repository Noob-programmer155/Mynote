package com.amrtm.mynoteapps.entity.repository.note.fetchjoin;

import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivateDTO;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;

public interface JoinFetchNotePrivateInterface {
    Flux<NotePrivateDTO> findByFilterPrivate(List<String> category, List<String> severity, UUID member, Pageable pageable);
}
