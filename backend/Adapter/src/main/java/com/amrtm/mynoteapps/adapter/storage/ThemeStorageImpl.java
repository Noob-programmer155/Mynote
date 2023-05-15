package com.amrtm.mynoteapps.adapter.storage;

import com.amrtm.mynoteapps.usecase.file.FileStorageImpl;
import reactor.core.publisher.Mono;

import java.nio.file.Path;

public class ThemeStorageImpl extends FileStorageImpl {
    public ThemeStorageImpl(Path base) {
        super(base);
    }
}
