package com.amrtm.mynoteapps.backend.model.other;

import com.amrtm.mynoteapps.backend.model.GlobalEntity;
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
@Table("login")
public class Login implements LoginInterface {
    @Id
    @Column("member")
    UUID member;
    @Column("token")
    String token;
}
