package com.amrtm.mynoteapps.backend.service.file;

import org.springframework.stereotype.Component;

import java.nio.file.Paths;

@Component
public class ThemeStorage extends FileStorage{
    public ThemeStorage() {
        super(Paths.get("./src/main/resources/images/theme/"));
    }
}
