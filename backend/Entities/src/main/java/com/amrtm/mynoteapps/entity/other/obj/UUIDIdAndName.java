package com.amrtm.mynoteapps.entity.other.obj;

import java.util.UUID;

public class UUIDIdAndName implements IdAndName<UUID> {
    private UUID id;
    private String name;

    public UUIDIdAndName() {
    }

    public UUIDIdAndName(UUID id, String name) {
        this.id = id;
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

    public static class builder {
        private UUID id;
        private String name;

        public builder id(UUID id) {
            this.id = id;
            return this;
        }

        public builder name(String name) {
            this.name = name;
            return this;
        }

        public UUIDIdAndName build() {
            return new UUIDIdAndName(id,name);
        }
    }
}
