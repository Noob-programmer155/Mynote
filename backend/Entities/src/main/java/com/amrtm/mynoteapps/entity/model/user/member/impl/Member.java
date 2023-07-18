package com.amrtm.mynoteapps.entity.model.user.member.impl;

import com.amrtm.mynoteapps.entity.model.user.member.MemberInterface;

import java.util.UUID;

public class Member implements MemberInterface {
    UUID id;
    String username;
    String password;
    String avatar;

    public Member() {
    }

    public Member(UUID id, String username, String password, String avatar) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.avatar = avatar;
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

    public static class builder {
        UUID id;
        String username;
        String password;
        String avatar;

        public builder id(UUID id) {
            this.id = id;
            return this;
        }

        public builder username(String username) {
            this.username = username;
            return this;
        }

        public builder password(String password) {
            this.password = password;
            return this;
        }

        public builder avatar(String avatar) {
            this.avatar = avatar;
            return this;
        }

        public Member build() {
            return new Member(id,username,password,avatar);
        }
    }
}
