package com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("member")
public class Member {
    @Id
    @Column("id")
    UUID id;
    @Column("name")
    String username;
    @Column("password")
    String password;
    @Column("avatar")
    String avatar;
    @Column("userFrom")
    UUID userFrom;

    public Member() {
    }

    public Member(UUID id, String username, String password, String avatar) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.avatar = avatar;
    }

    public Member(UUID id, String username, String password, String avatar, UUID userFrom) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.avatar = avatar;
        this.userFrom = userFrom;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public UUID getUserFrom() {
        return userFrom;
    }

    public void setUserFrom(UUID userFrom) {
        this.userFrom = userFrom;
    }
}
