package com.amrtm.mynoteapps.backend.model.relation;

import com.amrtm.mynoteapps.backend.model.main.MyNoteRelationEntity;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("theme_member")
public class ThemeMemberRel implements ThemeMemberRelInterface<UUID> {
    @Id
    @Column("id")
    Long id;
    @Column("theme")
    UUID parent;
    @Column("member")
    UUID child;
    @Column("isActive")
    Integer isActive;
}
