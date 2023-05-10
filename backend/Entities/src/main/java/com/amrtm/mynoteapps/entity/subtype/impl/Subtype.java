package com.amrtm.mynoteapps.entity.subtype.impl;

import com.amrtm.mynoteapps.entity.subtype.SubtypeEntity;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("subtype")
public class Subtype implements SubtypeEntity {
    @Id
    @Column("id")
    UUID id;
    @Column("name")
    String name;

    public Subtype() {
    }

    public Subtype(UUID id, String name) {
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
        UUID id;
        String name;

        public builder id(UUID id) {
            this.id = id;
            return this;
        }

        public builder name(String name) {
            this.name = name;
            return this;
        }

        public Subtype build() {
            return new Subtype(id,name);
        }
    }
}
