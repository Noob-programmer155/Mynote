package com.amrtm.mynoteapps.backend.service.file;

import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.UUID;

public abstract class FileStorage {
    private final Path base;

    public FileStorage(Path base) {
        this.base = base;
    }

    public Mono<byte[]> retrieveFile(String name) {
        try(FileInputStream fis = new FileInputStream(base.resolve(name).toFile())) {
            return Mono.just(fis.readAllBytes());
        } catch (IOException e) {
            return Mono.empty();
        }
    }

    public Mono<String> storeFile(FilePart filePart, String prefix, String name) {
        String title = (name != null)? name:prefix + UUID.nameUUIDFromBytes(filePart.filename().getBytes()) + ".jpg";
        return validateAndStore(filePart,title).thenReturn(title);
    }

    private Mono<Boolean> validateAndStore(FilePart filePart, String file) {
        if (filePart.headers().getContentType() != MediaType.IMAGE_JPEG)
            return DataBufferUtils.join(filePart.content()).map(item -> {
                        byte[] bytes = new byte[item.readableByteCount()];
                        item.read(bytes);
                        DataBufferUtils.release(item);
                        return bytes;
                    }).flatMap(item -> {
                        try {
                            BufferedImage bufImage = ImageIO.read(new ByteArrayInputStream(item));
                            BufferedImage newBufferedImage = new BufferedImage(
                                    bufImage.getWidth(),
                                    bufImage.getHeight(),
                                    BufferedImage.TYPE_INT_RGB);
                            newBufferedImage.createGraphics()
                                    .drawImage(bufImage,0,0, Color.WHITE,null);
                            ImageIO.write(newBufferedImage,"jpg",new File(base.resolve(file).toString()));
                            return Mono.empty();
                        } catch (IOException e) {
                            return Mono.error(new RuntimeException(e));
                        }
            }).thenReturn(true);
        else
            return filePart.transferTo(base.resolve(file)).thenReturn(true);
    }

    public Mono<Boolean> deleteFile(String name) {
        File fs = new File(base.resolve(name).toUri());
        if (fs.exists())
            return Mono.just(fs.delete());
        else
            return Mono.just(false);
    }
}
