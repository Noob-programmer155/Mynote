package com.amrtm.mynoteapps.backend.model.theme;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;
import org.springframework.data.util.Pair;

import java.time.LocalDateTime;
import java.util.UUID;

public interface ThemeDTOInterface extends MyNoteEntity {
    String getName();
    void setName(String name);
    String getBackground();
    void setBackground(String background);
    String getForeground();
    void setForeground(String foreground);
    String getBackground_color();
    void setBackground_color(String background_color);
    String getBackground_images();
    void setBackground_images(String background_images);
    String getBorder_color();
    void setBorder_color(String border_color);
    Pair<String, UUID> getCreatedBy();
    void setCreatedBy(Pair<String, UUID> createdBy);
    LocalDateTime getCreatedDate();
    void setCreatedDate(LocalDateTime createdDate);
}
