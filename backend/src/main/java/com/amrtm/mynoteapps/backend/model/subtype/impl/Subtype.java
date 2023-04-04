package com.amrtm.mynoteapps.backend.model.subtype.impl;

import com.amrtm.mynoteapps.backend.model.subtype.SubtypeEntity;
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
@Table("subtype")
public class Subtype implements SubtypeEntity {
    @Id
    @Column("id")
    UUID id;
    @Column("name")
    String name;
    @Column("color")
    String color;
}
