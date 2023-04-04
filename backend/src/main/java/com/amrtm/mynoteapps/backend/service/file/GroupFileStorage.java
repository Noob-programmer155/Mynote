package com.amrtm.mynoteapps.backend.service.file;

import org.springframework.stereotype.Component;

import java.nio.file.Paths;

@Component
public class GroupFileStorage extends FileStorage{
    public GroupFileStorage() {
        super(Paths.get("./src/main/resources/images/group/"));
    }
}
