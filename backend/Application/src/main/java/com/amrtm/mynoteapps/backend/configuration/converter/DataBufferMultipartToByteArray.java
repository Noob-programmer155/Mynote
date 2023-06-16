package com.amrtm.mynoteapps.backend.configuration.converter;

import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.other.utils.Tuple4;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.util.UUID;
import java.util.function.Function;

public class DataBufferMultipartToByteArray {
    public static Mono<Tuple4<byte[],String,Boolean,Function<Path,Mono<Void>>>> transform(FilePart filePart) {
        if (filePart != null)
            return DataBufferUtils.join(filePart.content()).map(item -> {
                byte[] bytes = new byte[item.readableByteCount()];
                item.read(bytes);
                DataBufferUtils.release(item);
                return new Tuple4<>(bytes, UUID.randomUUID().toString() + UUID.randomUUID() + UUID.randomUUID(), filePart.headers().getContentType() != MediaType.IMAGE_JPEG, filePart::transferTo);
            });
        else
            return Mono.just(new Tuple4<>(new byte[]{}, "", false, (base) -> Mono.empty()));
    }
}
