package com.amrtm.mynoteapps.entity.note.private_note;

import com.amrtm.mynoteapps.entity.note.NoteDTOInterface;
import com.amrtm.mynoteapps.entity.other.utils.Pair;

import java.util.List;

public interface PrivateNoteDTOInterface extends NoteDTOInterface {
    Pair<String,String> getSeverity();
    void setSeverity(Pair<String,String> severity);
    String getCategory();
    void setCategory(String category);
    List<String> getKeynotes();
    void setKeynotes(List<String> keynotes);
}
