-- liquibase formatted sql

--changeset Amar:create-table
--comment create table group
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS group_note(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE,
    password VARCHAR(1000),
    avatar VARCHAR(255)
);

--comment create table subtype
CREATE TABLE IF NOT EXISTS subtype(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255)
);

--comment create table theme
CREATE TABLE IF NOT EXISTS theme(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE,
    background_color VARCHAR(255),
    background_images VARCHAR(255),
    border_color VARCHAR(255),
    note_background VARCHAR(255),
    note_foreground VARCHAR(255),
    createdBy VARCHAR(300),
    createdDate TIMESTAMP DEFAULT LOCALTIMESTAMP NOT NULL
);

--comment create table user
CREATE TABLE IF NOT EXISTS member(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE,
    password VARCHAR(1000),
    avatar VARCHAR(255)
);

--comment create table note
CREATE TABLE IF NOT EXISTS note(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    type VARCHAR(255),
    description TEXT,
    keynotes TEXT,
    createdBy VARCHAR(300),
    createdDate TIMESTAMP DEFAULT LOCALTIMESTAMP NOT NULL,
    lastModifiedBy VARCHAR(300),
    lastModifiedDate TIMESTAMP DEFAULT LOCALTIMESTAMP NOT NULL,
    subtype uuid,
    member uuid,
    FOREIGN KEY (member) REFERENCES member(id) ON DELETE CASCADE,
    FOREIGN KEY (subtype) REFERENCES subtype(id)
);

--comment create table group_user
CREATE TABLE IF NOT EXISTS group_member(
    id bigserial PRIMARY KEY,
    group_note uuid,
    member uuid,
    role VARCHAR(255),
    isConfirmed INT,
    isDeleted INT,
    FOREIGN KEY (group_note) REFERENCES group_note(id) ON DELETE CASCADE,
    FOREIGN KEY (member) REFERENCES member(id) ON DELETE CASCADE
);

--comment create subtype_note
CREATE TABLE IF NOT EXISTS group_subtype(
    id bigserial PRIMARY KEY,
    group_note uuid,
    subtype uuid,
    FOREIGN KEY (group_note) REFERENCES group_note(id) ON DELETE CASCADE,
    FOREIGN KEY (subtype) REFERENCES subtype(id) ON DELETE CASCADE
);

--comment create theme_note
CREATE TABLE IF NOT EXISTS theme_member(
    id bigserial PRIMARY KEY,
    theme uuid,
    member uuid,
    isActive INT,
    FOREIGN KEY (theme) REFERENCES theme(id) ON DELETE CASCADE,
    FOREIGN KEY (member) REFERENCES member(id) ON DELETE CASCADE
);

--changeset Amar:alter-table
--comment alter note
ALTER TABLE note
    DROP CONSTRAINT note_subtype_fkey,
    ADD CONSTRAINT note_subtype_fkey FOREIGN KEY (subtype) REFERENCES subtype(id) ON DELETE CASCADE

--changeset Amar:create-table-member-login
--comment alter note
CREATE TABLE IF NOT EXISTS login(
    member uuid PRIMARY KEY,
    token VARCHAR(5000),
    FOREIGN KEY (member) REFERENCES member(id) ON DELETE CASCADE
)

--changeset Amar:alter-table-2
--comment alter note
ALTER TABLE note
    ADD category VARCHAR(500),
    ADD severity VARCHAR(500);

--changeset Amar:alter-table-note-2
--comment alter note-2
ALTER TABLE note
    DROP COLUMN type;

--changeset Amar:alter-table-theme-2
--comment alter theme-2
ALTER TABLE note
    ADD foreground_color VARCHAR(50),
    ADD danger_background VARCHAR(50),
    ADD danger_foreground VARCHAR(50),
    ADD info_background VARCHAR(50),
    ADD info_foreground VARCHAR(50),
    ADD default_background VARCHAR(50),
    ADD default_foreground VARCHAR(50);

--changeset Amar:alter-table-subtype-2
--comment alter subtype-2
ALTER TABLE subtype ADD color VARCHAR(50);

--changeset Amar:alter-table-group-1
--comment alter group-1
ALTER TABLE group_note DROP password;

--changeset Amar:alter-table-theme-3
--comment alter theme-3
ALTER TABLE note
    DROP foreground_color,
    DROP danger_background,
    DROP danger_foreground,
    DROP info_background,
    DROP info_foreground,
    DROP default_background,
    DROP default_foreground;
ALTER TABLE theme
    ADD foreground_color VARCHAR(50),
    ADD danger_background VARCHAR(50),
    ADD danger_foreground VARCHAR(50),
    ADD info_background VARCHAR(50),
    ADD info_foreground VARCHAR(50),
    ADD default_background VARCHAR(50),
    ADD default_foreground VARCHAR(50);

--changeset Amar:alter-table-group_subtype-1
--comment alter group_subtype-1
ALTER TABLE group_subtype ADD index INT

--changeset Amar:alter-table-group_subtype-2
--comment alter group_subtype-2
ALTER TABLE group_subtype ADD color VARCHAR(50);
ALTER TABLE subtype DROP color;