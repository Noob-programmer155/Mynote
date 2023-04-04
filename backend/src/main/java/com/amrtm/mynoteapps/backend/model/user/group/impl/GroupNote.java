package com.amrtm.mynoteapps.backend.model.user.group.impl;

import com.amrtm.mynoteapps.backend.model.user.group.GroupNoteInterface;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("group_note")
public class GroupNote implements GroupNoteInterface {
    @Id
    @Column("id")
    UUID id;
    @Column("name")
    String username;
    @Column("password")
    String password;
    @Column("avatar")
    String avatar;
}
