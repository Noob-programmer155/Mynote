package com.amrtm.mynoteapps.backend.model.relation;

import com.amrtm.mynoteapps.backend.model.main.MyNoteRelationEntity;
import com.amrtm.mynoteapps.backend.model.other.Role;
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
@Table("group_member")
public class GroupMemberRel implements GroupMemberRelInterface<UUID> {
    @Id
    @Column("id")
    Long id;
    @Column("group_note")
    UUID parent;
    @Column("member")
    UUID child;
    @Column("role")
    Role role;
    @Column("isDeleted")
    Integer isDeleted;
    @Column("isConfirmed")
    Integer isConfirmed;
}
