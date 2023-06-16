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
    @Column("color")
    String color;

    public Subtype() {
    }

    public Subtype(UUID id, String name, String color) {
        this.id = id;
        this.name = name;
        this.color = color;
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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
