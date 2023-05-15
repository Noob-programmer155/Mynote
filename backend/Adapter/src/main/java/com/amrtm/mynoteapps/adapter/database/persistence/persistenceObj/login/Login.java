package com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.login;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("login")
public class Login {
    @Id
    @Column("member")
    UUID member;
    @Column("token")
    String token;

    public Login() {}

    public Login(UUID member, String token) {
        this.member = member;
        this.token = token;
    }

    public UUID getMember() {
        return member;
    }

    public void setMember(UUID member) {
        this.member = member;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
