package com.amrtm.mynoteapps.entity.note.collab_note;

import com.amrtm.mynoteapps.entity.note.NoteDTOInterface;
import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.subtype.impl.SubtypeDTO;

import java.util.List;

public interface CollabNoteDTOInterface extends NoteDTOInterface {
    Pair<String,String> getSeverity();
    void setSeverity(Pair<String,String> severity);
    List<String> getKeynotes();
    void setKeynotes(List<String> keynotes);
    SubtypeDTO getSubtype();
    void setSubtype(SubtypeDTO subtype);
}
