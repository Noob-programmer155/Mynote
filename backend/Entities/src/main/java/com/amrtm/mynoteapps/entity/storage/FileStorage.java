package com.amrtm.mynoteapps.entity.storage;

import reactor.core.publisher.Mono;

public interface FileStorage {
    Mono<byte[]> retrieveFile(String name);

    Mono<String> storeFile(byte[] filePart, String filename, String prefix, String name);

    Mono<Void> createImage(byte[] data,String filename);

    Mono<Boolean> validateAndStore(byte[] filePart, String filename, boolean condition, Mono<Boolean> elseCondition);

    Mono<Boolean> deleteFile(String name);
}
