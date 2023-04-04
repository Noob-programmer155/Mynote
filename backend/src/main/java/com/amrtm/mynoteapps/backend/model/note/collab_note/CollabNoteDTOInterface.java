package com.amrtm.mynoteapps.backend.model.note.collab_note;

import com.amrtm.mynoteapps.backend.model.note.NoteDTOInterface;
import com.amrtm.mynoteapps.backend.model.subtype.impl.SubtypeDTO;
import org.springframework.data.util.Pair;

import java.util.List;
import java.util.UUID;

public interface CollabNoteDTOInterface extends NoteDTOInterface {
    Pair<String,String> getSeverity();
    void setSeverity(Pair<String,String> severity);
    List<String> getKeynotes();
    void setKeynotes(List<String> keynotes);
    SubtypeDTO getSubtype();
    void setSubtype(SubtypeDTO subtype);
}
