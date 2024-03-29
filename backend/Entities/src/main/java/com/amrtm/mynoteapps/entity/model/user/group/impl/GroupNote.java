package com.amrtm.mynoteapps.entity.model.user.group.impl;

import com.amrtm.mynoteapps.entity.model.user.group.GroupNoteInterface;

import java.util.UUID;

public class GroupNote implements GroupNoteInterface {
    UUID id;
    String username;
    String avatar;
    public GroupNote() {
    }

    public GroupNote(UUID id, String username, String avatar) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
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

    public static class builder {
        UUID id;
        String username;
        String avatar;

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

        public GroupNote build() {
            return new GroupNote(id,username,avatar);
        }
    }
}
