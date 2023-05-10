package com.amrtm.mynoteapps.entity.user.member.impl;

import com.amrtm.mynoteapps.entity.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.user.member.MemberDTOInterface;

import java.util.UUID;

public class MemberDTO implements MemberDTOInterface {
    UUID id;
    String username;
    String password;
    String avatar;
    ThemeDTO theme;
    Role role;

    public MemberDTO() {
    }

    public MemberDTO(UUID id, String username, String password, String avatar, ThemeDTO theme, Role role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.avatar = avatar;
        this.theme = theme;
        this.role = role;
    }

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public void setId(UUID id) {
        this.id = id;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String getAvatar() {
        return avatar;
    }

    @Override
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    @Override
    public ThemeDTO getTheme() {
        return theme;
    }

    @Override
    public void setTheme(ThemeDTO theme) {
        this.theme = theme;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public static class builder {
        private UUID id;
        private String username;
        private String password;
        private String avatar;
        private ThemeDTO theme;
        private Role role;

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

        public builder theme(ThemeDTO theme) {
            this.theme = theme;
            return this;
        }

        public builder role(Role role) {
            this.role = role;
            return this;
        }

        public MemberDTO build() {
            return new MemberDTO(id,username,password,avatar,theme,role);
        }
    }
}
