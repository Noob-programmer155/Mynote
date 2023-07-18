package com.amrtm.mynoteapps.entity.model.theme;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;
import com.amrtm.mynoteapps.entity.other.utils.Pair;

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
    String getForeground_color();

    void setForeground_color(String foreground_color);

    String getDanger_background();

    void setDanger_background(String danger_background);

    String getDanger_foreground();

    void setDanger_foreground(String danger_foreground);

    String getInfo_background();

    void setInfo_background(String info_background);

    String getInfo_foreground();

    void setInfo_foreground(String info_foreground);

    String getDefault_background();

    void setDefault_background(String default_background);

    String getDefault_foreground();

    void setDefault_foreground(String default_foreground);

    Boolean getIsMyTheme();

    void setIsMyTheme(Boolean myTheme);
}
