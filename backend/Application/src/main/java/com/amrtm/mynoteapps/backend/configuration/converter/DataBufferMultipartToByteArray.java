package com.amrtm.mynoteapps.backend.configuration.converter;

import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;

public class DataBufferMultipartToByteArray {
    public static Mono<byte[]> transform(FilePart filePart) {
        if (filePart != null)
            return DataBufferUtils.join(filePart.content()).map(item -> {
                byte[] bytes = new byte[item.readableByteCount()];
                item.read(bytes);
                DataBufferUtils.release(item);
                return bytes;
            });
        else
            return Mono.just(new byte[]{});
    }
}
