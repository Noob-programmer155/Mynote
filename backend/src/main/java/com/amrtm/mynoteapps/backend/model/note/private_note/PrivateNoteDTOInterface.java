package com.amrtm.mynoteapps.backend.model.note.private_note;

import com.amrtm.mynoteapps.backend.model.note.NoteDTOInterface;
import org.springframework.data.util.Pair;

import java.util.List;

public interface PrivateNoteDTOInterface extends NoteDTOInterface {
    Pair<String,String> getSeverity();
    void setSeverity(Pair<String,String> severity);
    String getCategory();
    void setCategory(String category);
    List<String> getKeynotes();
    void setKeynotes(List<String> keynotes);
}
