package com.amrtm.mynoteapps.backend.model.user.member.impl;

import com.amrtm.mynoteapps.backend.model.user.UserEntity;
import com.amrtm.mynoteapps.backend.model.user.member.MemberInterface;
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
@Table("member")
public class Member implements MemberInterface {
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
