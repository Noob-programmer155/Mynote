package com.amrtm.mynoteapps.entity.repository.note;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;
import com.amrtm.mynoteapps.entity.repository.MyNoteRepo;

public interface NoteRepo<E extends MyNoteEntity,ID> extends MyNoteRepo<E, ID> {
}
