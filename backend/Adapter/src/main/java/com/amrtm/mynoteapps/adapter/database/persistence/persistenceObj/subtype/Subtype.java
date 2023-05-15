package com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.subtype;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("subtype")
public class Subtype {
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

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

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
