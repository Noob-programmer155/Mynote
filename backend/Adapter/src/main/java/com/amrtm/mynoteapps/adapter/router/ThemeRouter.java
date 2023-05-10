package com.amrtm.mynoteapps.adapter.router;

import com.amrtm.mynoteapps.adapter.storage.ThemeStorageImpl;
import com.amrtm.mynoteapps.entity.other.utils.SingleData;
import com.amrtm.mynoteapps.entity.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import com.amrtm.mynoteapps.usecase.theme.ThemeService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public class ThemeRouter {
    private final ThemeService<ThemeStorageImpl> themeService;
    private final com.amrtm.mynoteapps.adapter.router.routerfunc.pagingandsorting.PagingAndSorting pagingAndSorting;

    public ThemeRouter(ThemeService<ThemeStorageImpl> themeService, com.amrtm.mynoteapps.adapter.router.routerfunc.pagingandsorting.PagingAndSorting pagingAndSorting) {
        this.themeService = themeService;
        this.pagingAndSorting = pagingAndSorting;
    }

    public Mono<byte[]> getAvatar(String name) {
        return themeService.getAvatar(name).switchIfEmpty(Mono.just(new byte[]{}));
    }

    public Flux<UUIDIdAndName> searchByName(String name, int page, int size) {
        return themeService.findByNameLike(name, pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Flux<ThemeDTO> searchByNameData(String name, int page, int size) {
        return themeService.findByNameLikeSearch(name, pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Flux<UUIDIdAndName> getByNameInMember(String name, int page, int size) {
        return themeService.findByNameLikeMember(name, pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Flux<ThemeDTO> getByNameDataInMember(String name, int page, int size) {
        return themeService.findByNameLikeSearchMember(name, pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Mono<SingleData<Boolean>> validateNameTheme(String name) {
        return themeService.validateName(name).map(SingleData::new);
    }

    public Mono<ThemeDTO> save(ThemeDTO themeDTO, byte[] filePart, String filename) {
        return themeService.save(themeDTO,filePart,filename,false);
    }

    public Mono<ThemeDTO> update(ThemeDTO themeDTO, byte[] filePart, String filename) {
        return themeService.save(themeDTO,filePart,filename,true);
    }

    public Mono<SingleData<Boolean>> activateTheme(UUID theme) {
        return themeService.activateTheme(theme).map(SingleData::new);
    }

    public Mono<SingleData<Boolean>> addRelationMember(UUID theme) {
        return themeService.addNewTheme(theme).map(SingleData::new);
    }

    public Mono<SingleData<Boolean>> removeRelationMember(UUID theme) {
        return themeService.removeTheme(theme).then(Mono.just(new SingleData<>(true)));
    }

    public Mono<SingleData<Boolean>> delete(UUID theme) {
        return themeService.deleteById(theme).then(Mono.just(new SingleData<>(true)));
    }
}
