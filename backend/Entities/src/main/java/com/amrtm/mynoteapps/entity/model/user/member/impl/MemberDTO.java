package com.amrtm.mynoteapps.entity.model.user.member.impl;

import com.amrtm.mynoteapps.entity.model.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.model.user.member.MemberDTOInterface;

import java.util.UUID;

public class MemberDTO implements MemberDTOInterface {
    UUID id;
    String username;
    String password;
    String avatar;
    ThemeDTO theme;
    boolean notificationFrom;
    Role role;

    public MemberDTO() {
    }

    public MemberDTO(UUID id, String username, String password, String avatar, ThemeDTO theme, boolean notificationFrom, Role role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.avatar = avatar;
        this.theme = theme;
        this.notificationFrom = notificationFrom;
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

    public boolean isNotificationFrom() {
        return notificationFrom;
    }

    public void setNotificationFrom(boolean notificationFrom) {
        this.notificationFrom = notificationFrom;
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
        boolean notificationFrom;
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

        public builder notificationFrom(boolean notificationFrom) {
            this.notificationFrom = notificationFrom;
            return this;
        }

        public MemberDTO build() {
            return new MemberDTO(id,username,password,avatar,theme,notificationFrom,role);
        }
    }
}
