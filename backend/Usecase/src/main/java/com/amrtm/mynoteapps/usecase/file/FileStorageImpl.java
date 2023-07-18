package com.amrtm.mynoteapps.usecase.file;

import com.amrtm.mynoteapps.entity.storage.FileStorage;
import reactor.core.publisher.Mono;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FileStorageImpl implements FileStorage {
    private final Path base;

    public FileStorageImpl(Path base) {
        this.base = base;
    }

    private Mono<Boolean> validateNameImage(String name) {
        Pattern pattern = Pattern.compile("[\\.]{2}|/",Pattern.CASE_INSENSITIVE);
        return Mono.just(pattern.matcher(name).find());
    }

    public Mono<byte[]> retrieveFile(String name) {
        return validateNameImage(name)
                .filter(is -> !is)
                .switchIfEmpty(Mono.error(new IllegalStateException("are you sure ???")))
                .flatMap(is -> {
                    try(FileInputStream fis = new FileInputStream(base.resolve(name).toFile())) {
                        return Mono.just(fis.readAllBytes());
                    } catch (IOException e) {
                        return Mono.empty();
                    }
                });
    }

    public Mono<String> storeFile(byte[] filePart, String filename, String prefix, String name, boolean condition, Function<Path,Mono<Void>> elseCondition) {
        return Mono.just(name)
                .filter(is -> is != null && !is.isBlank())
                .flatMap(this::validateNameImage)
                .flatMap(valid -> {
                    if(!valid)
                        return deleteFile(name);
                    else
                        return Mono.error(new IllegalStateException("are you sure ???"));
                })
                .flatMap(is -> {if(is) return Mono.just(prefix + filename + ".jpg"); else throw new RuntimeException("cannot delete image");})
                .switchIfEmpty(
                        Mono.just(prefix + filename + ".jpg")
                                .flatMap(newName -> validateNameImage(newName)
                                        .flatMap(valid -> {
                                            if(!valid)
                                                return Mono.just(newName);
                                            else
                                                return Mono.error(new IllegalStateException("are you sure ???"));
                                        })
                ))
                .flatMap(title -> validateAndStore(filePart,title,condition,elseCondition).then(Mono.just(title)));
    }

    public Mono<Void> createImage(byte[] data,String filename) {
        try {
            BufferedImage bufImage = ImageIO.read(new ByteArrayInputStream(data));
            BufferedImage newBufferedImage = new BufferedImage(
                    bufImage.getWidth(),
                    bufImage.getHeight(),
                    BufferedImage.TYPE_INT_RGB);
            newBufferedImage.createGraphics()
                    .drawImage(bufImage,0,0, Color.WHITE,null);
            if (!Files.exists(base))
                Files.createDirectories(base);
            ImageIO.write(newBufferedImage,"jpg",new File(base.resolve(filename).toString()));
            return Mono.empty();
        } catch (IOException e) {
            return Mono.error(new IllegalArgumentException("Image is not in proper condition, please change another images"));
        }
    }

    public Mono<Boolean> validateAndStore(byte[] filePart, String filename, boolean condition, Function<Path,Mono<Void>> elseCondition) {
        if (condition)
            return createImage(filePart,filename).then(Mono.just(true));
        else
            return elseCondition.apply(base.resolve(filename)).then(Mono.just(true));
    }

    public Mono<Boolean> deleteFile(String name) {
        return validateNameImage(name)
                .filter(is -> !is)
                .switchIfEmpty(Mono.error(new IllegalStateException("are you sure ???")))
                .flatMap(is -> {
                    File fs = new File(base.resolve(name).toUri());
                    if (fs.exists())
                        return Mono.just(fs.delete());
                    else
                        return Mono.just(false);
                });
    }
}
