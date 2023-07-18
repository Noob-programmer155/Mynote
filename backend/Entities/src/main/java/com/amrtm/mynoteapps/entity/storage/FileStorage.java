package com.amrtm.mynoteapps.entity.storage;

import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.util.function.Function;

public interface FileStorage {
    Mono<byte[]> retrieveFile(String name);

    Mono<String> storeFile(byte[] filePart, String filename, String prefix, String name, boolean condition, Function<Path,Mono<Void>> elseCondition);

    Mono<Void> createImage(byte[] data,String filename);

    Mono<Boolean> validateAndStore(byte[] filePart, String filename, boolean condition, Function<Path,Mono<Void>> elseCondition);

    Mono<Boolean> deleteFile(String name);
}
