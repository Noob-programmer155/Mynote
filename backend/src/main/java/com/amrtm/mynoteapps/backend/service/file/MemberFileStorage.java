package com.amrtm.mynoteapps.backend.service.file;

import org.springframework.stereotype.Component;

import java.nio.file.Paths;

@Component
public class MemberFileStorage extends FileStorage{
    public MemberFileStorage() {
        super(Paths.get("./src/main/resources/images/member/"));
    }
}
