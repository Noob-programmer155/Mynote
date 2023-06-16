package com.amrtm.mynoteapps.usecase.theme;

import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.repository.relation.ThemeMemberRepoRelation;
import com.amrtm.mynoteapps.entity.repository.theme.ThemeRepoImpl;
import com.amrtm.mynoteapps.entity.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.entity.theme.impl.Theme;
import com.amrtm.mynoteapps.entity.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.entity.relation.ThemeMemberRel;
import com.amrtm.mynoteapps.entity.user.member.impl.Member;
import com.amrtm.mynoteapps.usecase.converter.entity_converter.ThemeConverter;
import com.amrtm.mynoteapps.usecase.file.FileStorageImpl;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import com.amrtm.mynoteapps.usecase.security.AuthValidation;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.util.UUID;
import java.util.function.Function;

public class ThemeService<Storage extends FileStorageImpl,PagingAndSorting> implements ThemeServiceArc<ThemeDTO, UUID, PagingAndSorting> {
    private final ThemeRepoImpl<Theme,PagingAndSorting> themeRepo;
    private final ThemeConverter themeConverter;
    private final AuthValidation authValidation;
    private final ThemeMemberRepoRelation<ThemeMemberRel> themeMemberRepoRelation;
    private final MemberRepoImpl<Member,PagingAndSorting> memberRepo;
    private final Storage themeStorage;
    private final String delimiter;

    public ThemeService(String delimiter,ThemeRepoImpl<Theme,PagingAndSorting> themeRepo, ThemeConverter themeConverter, AuthValidation authValidation,
                        ThemeMemberRepoRelation<ThemeMemberRel> themeMemberRepoRelation, MemberRepoImpl<Member,PagingAndSorting> memberRepo, Storage themeStorage) {
        this.delimiter = delimiter;
        this.themeRepo = themeRepo;
        this.themeConverter = themeConverter;
        this.authValidation = authValidation;
        this.themeMemberRepoRelation = themeMemberRepoRelation;
        this.memberRepo = memberRepo;
        this.themeStorage = themeStorage;
    }

    @Override
    public Flux<ThemeDTO> findByNameLikeSearchMember(String name, PagingAndSorting pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(item -> themeRepo.findByNameLikeAndMember(name,item,pageable).map(themeConverter::convertTo)
                        .map(theme -> {
                            theme.setIsMyTheme(true);
                            return theme;
                        }));
    }

    @Override
    public Mono<byte[]> getAvatar(String name) {
        return themeStorage.retrieveFile(name);
    }

    @Override
    public Flux<UUIDIdAndName> findByNameLikeMember(String name, PagingAndSorting pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(item -> themeRepo.findByNameLikeAndMember(name,item,pageable).map(data -> new UUIDIdAndName.builder()
                        .id(data.getId())
                        .name(data.getName())
                        .build())
                );
    }

    @Override
    public Flux<ThemeDTO> findByNameLikeSearch(String name, PagingAndSorting pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(id -> themeRepo.findByNameLike(name,id,pageable))
                .map(themeConverter::convertTo).map(theme -> {
                    theme.setIsMyTheme(false);
                    return theme;
                });
    }

    @Override
    public Mono<Boolean> validateName(String name) {
        return themeRepo.findByName(name).hasElement().map(item -> !item);
    }

    @Override
    public Flux<UUIDIdAndName> findByNameLike(String name, PagingAndSorting pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(id -> themeRepo.findByNameLike(name,id,pageable))
                .map(item -> new UUIDIdAndName.builder()
                    .id(item.getId())
                    .name(item.getName())
                    .build()
                );
    }

    @Override
    public Mono<ThemeDTO> save(ThemeDTO data, byte[] filePart, String filename, boolean update,boolean condition, Function<Path,Mono<Void>> elseCondition) {
        return authValidation.getValidation()
                .flatMap(memberRepo::findByName).map(Member::getId)
                .flatMap(ids -> {
                    if (filePart.length > 0)
                        return Mono.just(update)
                                .filter(is -> is)
                                .flatMap(is -> themeRepo.findById(data.getId()))
                                .flatMap(item ->
                                        Mono.just(UUID.fromString((item.getCreatedBy()).split(delimiter)[1]).equals(ids))
                                                .filter(is -> is)
                                                .switchIfEmpty(Mono.error(new IllegalAccessError("You`re not owner !!!")))
                                                .flatMap(is -> themeStorage.storeFile(filePart, filename, "theme", (item.getBackground_images() != null && !item.getBackground_images().isBlank())?item.getBackground_images():"", condition, elseCondition))
                                                .flatMap(file -> {data.setBackground_images(file);return themeRepo.save(themeConverter.deconvert(data, item));}))
                                .switchIfEmpty(
                                        themeStorage.storeFile(filePart, filename, "theme", "", condition, elseCondition)
                                                .flatMap(file -> {data.setBackground_images(file);return themeRepo.save(themeConverter.deconvert(data));})
                                                .flatMap(theme -> themeMemberRepoRelation.save(new ThemeMemberRel.builder()
                                                        .parent(theme.getId())
                                                        .child(ids)
                                                        .isActive(0)
                                                        .build()).then(Mono.just(theme))))
                                .map(item -> {
                                    ThemeDTO theme = themeConverter.convertTo(item);
                                    theme.setIsMyTheme(true);
                                    return theme;
                                });
                    else
                        return Mono.just(update)
                                .filter(is -> is)
                                .flatMap(is -> themeRepo.findById(data.getId()))
                                .flatMap(item ->
                                        Mono.just(UUID.fromString((item.getCreatedBy()).split(delimiter)[1]).equals(ids))
                                                .filter(is -> is)
                                                .switchIfEmpty(Mono.error(new IllegalAccessError("You`re not owner !!!")))
                                                .flatMap(is -> themeRepo.save(themeConverter.deconvert(data, item))))
                                .switchIfEmpty(themeRepo.save(themeConverter.deconvert(data))
                                        .flatMap(theme -> themeMemberRepoRelation.save(new ThemeMemberRel.builder()
                                                .parent(theme.getId())
                                                .child(ids)
                                                .isActive(0)
                                                .build()).then(Mono.just(theme))))
                                .map(item -> {
                                    ThemeDTO theme = themeConverter.convertTo(item);
                                    theme.setIsMyTheme(true);
                                    return theme;
                                });
                });
    }

    @Override
    public Mono<Boolean> addNewTheme(UUID theme) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> themeMemberRepoRelation.save(new ThemeMemberRel.builder()
                        .parent(theme).child(item).isActive(0).build())
                ).hasElement();
    }

    public Mono<Boolean> activateTheme(UUID theme) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> themeMemberRepoRelation.findByActiveState(item)
                        .flatMap(active -> {
                            active.setIsActive(0);
                            return themeMemberRepoRelation.save(active).map(ThemeMemberRel::getChild);
                        }).switchIfEmpty(Mono.just(item)))
                .flatMap(item -> themeMemberRepoRelation.findByParentAndChild(theme,item))
                .flatMap(item -> {
                    item.setIsActive(1);
                    return themeMemberRepoRelation.save(item);
                }).hasElement();
    }

    @Override
    public Mono<Void> removeTheme(UUID theme) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> themeMemberRepoRelation.findByParentAndChild(theme,item)
                        .switchIfEmpty(Mono.error(new IllegalAccessException("You does`nt have this theme")))
                        .flatMap(data -> themeMemberRepoRelation.deleteByParentAndChild(theme,item)));
    }

    @Override
    public Mono<Void> deleteById(UUID uuid) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> themeMemberRepoRelation.findByParentAndChild(uuid,item))
                .switchIfEmpty(Mono.error(new IllegalAccessException("You does`nt have this theme")))
                .flatMap(item -> themeRepo.findById(uuid))
                .flatMap(item -> {
                    if (item.getBackground_images() != null && !item.getBackground_images().isBlank())
                        return themeStorage.deleteFile(item.getBackground_images())
                                .flatMap(data -> {
                                    if (data) return themeRepo.deleteById(uuid);
                                    else return Mono.error(new RuntimeException("cannot delete image"));
                                });
                    else
                        return themeRepo.deleteById(uuid);
                });
    }
}
