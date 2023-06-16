package com.amrtm.mynoteapps.entity.user.group.impl;

import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.user.group.GroupNoteDTOInterface;

import java.util.UUID;

public class GroupNoteDTO implements GroupNoteDTOInterface {
    UUID id;
    String username;
    String avatar;
    Boolean isMember;
    Role roleMember;
    boolean notificationFrom;

    public GroupNoteDTO() {
    }

    public GroupNoteDTO(UUID id, String username, String avatar, Boolean isMember, Role roleMember, boolean notificationFrom) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.isMember = isMember;
        this.roleMember = roleMember;
        this.notificationFrom = notificationFrom;
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
    public String getAvatar() {
        return avatar;
    }

    @Override
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Boolean getIsMember() {
        return isMember;
    }

    public void setIsMember(Boolean member) {
        isMember = member;
    }

    public Role getRoleMember() {
        return roleMember;
    }

    public void setRoleMember(Role roleMember) {
        this.roleMember = roleMember;
    }

    @Override
    public boolean isNotificationFrom() {
        return notificationFrom;
    }
    @Override
    public void setNotificationFrom(boolean notificationFrom) {
        this.notificationFrom = notificationFrom;
    }

    public static class builder {
        private UUID id;
        private String username;
        private String avatar;
        private Boolean isMember;
        private Role roleMember;
        private boolean notificationFrom;

        public builder id(UUID id) {
            this.id = id;
            return this;
        }

        public builder username(String username) {
            this.username = username;
            return this;
        }

        public builder avatar(String avatar) {
            this.avatar = avatar;
            return this;
        }

        public builder isMember(Boolean isMember) {
            this.isMember = isMember;
            return this;
        }

        public builder roleMember(Role roleMember) {
            this.roleMember = roleMember;
            return this;
        }

        public builder notificationFrom(boolean notificationFrom) {
            this.notificationFrom = notificationFrom;
            return this;
        }

        public GroupNoteDTO build() {
            return new GroupNoteDTO(id,username,avatar,isMember,roleMember,notificationFrom);
        }
    }
}
