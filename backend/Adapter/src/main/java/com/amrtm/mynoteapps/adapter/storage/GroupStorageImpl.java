package com.amrtm.mynoteapps.adapter.storage;

import com.amrtm.mynoteapps.usecase.file.FileStorageImpl;
import reactor.core.publisher.Mono;

import java.nio.file.Path;

public class GroupStorageImpl extends FileStorageImpl {

    public GroupStorageImpl(Path base) {
        super(base);
    }
}
