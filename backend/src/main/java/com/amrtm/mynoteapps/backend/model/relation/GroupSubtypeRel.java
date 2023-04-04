package com.amrtm.mynoteapps.backend.model.relation;

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
@Table("group_subtype")
public class GroupSubtypeRel implements GroupSubtypeRelInterface<UUID> {
    @Id
    @Column("id")
    Long id;
    @Column("group_note")
    UUID parent;
    @Column("subtype")
    UUID child;
}
