package com.amrtm.mynoteapps.backend.repository.note;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;
import com.amrtm.mynoteapps.backend.repository.MyNoteRepo;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;

import java.util.List;

public interface NoteRepo<E extends MyNoteEntity,ID> extends MyNoteRepo<E, ID> {
}
