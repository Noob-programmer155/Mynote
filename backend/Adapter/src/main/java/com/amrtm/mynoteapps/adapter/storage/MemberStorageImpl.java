package com.amrtm.mynoteapps.adapter.storage;

import com.amrtm.mynoteapps.usecase.file.FileStorageImpl;
import reactor.core.publisher.Mono;

import java.nio.file.Path;

public class MemberStorageImpl extends FileStorageImpl {

    public MemberStorageImpl(Path base) {
        super(base);
    }
}
