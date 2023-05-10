package com.amrtm.mynoteapps.entity.subtype.impl;

import com.amrtm.mynoteapps.entity.subtype.SubtypeDTOInterface;

import java.util.UUID;
public class SubtypeDTO implements SubtypeDTOInterface {
    UUID id;
    String name;
    String color;

    public SubtypeDTO() {
    }

    public SubtypeDTO(UUID id, String color, String name) {
        this.id = id;
        this.color = color;
        this.name = name;
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
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public static class builder {
        UUID id;
        String name;
        String color;

        public builder id(UUID id) {
            this.id = id;
            return this;
        }

        public builder name(String name) {
            this.name = name;
            return this;
        }

        public builder color(String color) {
            this.color = color;
            return this;
        }

        public SubtypeDTO build() {
            return new SubtypeDTO(id,color,name);
        }
    }
}
