package com.amrtm.mynoteapps.backend.service.model.theme;

import com.amrtm.mynoteapps.backend.converter.entity_converter.ThemeConverter;
import com.amrtm.mynoteapps.backend.model.relation.ThemeMemberRel;
import com.amrtm.mynoteapps.backend.model.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.backend.model.user.member.impl.Member;
import com.amrtm.mynoteapps.backend.repository.relation.ThemeMemberRepoRelation;
import com.amrtm.mynoteapps.backend.repository.theme.ThemeRepoImpl;
import com.amrtm.mynoteapps.backend.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.backend.service.file.ThemeStorage;
import com.amrtm.mynoteapps.backend.service.other.UUIDIdAndName;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ThemeService implements ThemeServiceArc<ThemeDTO, UUID>{
    private final ThemeRepoImpl themeRepo;
    private final ThemeConverter themeConverter;
    private final ThemeMemberRepoRelation themeMemberRepoRelation;
    private final MemberRepoImpl memberRepo;
    private final ThemeStorage themeStorage;
    
    @Override
    public Flux<ThemeDTO> findByNameLikeSearchMember(String name, Pageable pageable) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMapMany(item -> themeRepo.findByNameLikeAndMember(name,item,pageable).map(themeConverter::convertTo));
    }

    @Override
    public Mono<byte[]> getAvatar(String name) {
        return themeStorage.retrieveFile(name);
    }

    @Override
    public Flux<UUIDIdAndName> findByNameLikeMember(String name,Pageable pageable) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMapMany(item -> themeRepo.findByNameLikeAndMember(name,item,pageable).map(data -> UUIDIdAndName.builder()
                        .id(data.getId())
                        .name(data.getName())
                        .build())
                );
    }

    @Override
    public Flux<ThemeDTO> findByNameLikeSearch(String name, Pageable pageable) {
        return themeRepo.findByNameLike(name, pageable).map(themeConverter::convertTo);
    }

    @Override
    public Mono<Boolean> validateName(String name) {
        return themeRepo.findByName(name).hasElement().map(item -> !item);
    }

    @Override
    public Flux<UUIDIdAndName> findByNameLike(String name, Pageable pageable) {
        return themeRepo.findByNameLike(name, pageable).map(item -> UUIDIdAndName.builder()
                .id(item.getId())
                .name(item.getName())
                .build());
    }

    @Override
    public Mono<ThemeDTO> save(ThemeDTO data, FilePart filePart, boolean update) {
        if (update) {
            if (filePart != null)
                return themeStorage.storeFile(filePart,"theme", data.getBackground_images())
                        .flatMap(item -> {
                            data.setBackground_images(item);
                            return themeRepo.findById(data.getId())
                                    .flatMap(theme -> themeRepo.save(themeConverter.deconvert(data,theme))
                                            .map(themeConverter::convertTo));
                        });
            else
                return themeRepo.findById(data.getId())
                        .flatMap(item -> themeRepo.save(themeConverter.deconvert(data,item)).map(themeConverter::convertTo));
        } else {
            if (filePart != null)
                return ReactiveSecurityContextHolder.getContext()
                        .map(SecurityContext::getAuthentication)
                        .filter(Authentication::isAuthenticated)
                        .map(UsernamePasswordAuthenticationToken.class::cast)
                        .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                        .flatMap(ids -> themeStorage.storeFile(filePart,"theme", data.getBackground_images())
                                    .flatMap(item -> {
                                        data.setBackground_images(item);
                                        return themeRepo.save(themeConverter.deconvert(data));
                                    }).flatMap(theme -> themeMemberRepoRelation.save(ThemeMemberRel.builder()
                                            .parent(theme.getId())
                                            .child(ids)
                                            .isActive(0)
                                            .build()).thenReturn(theme))
                        ).map(themeConverter::convertTo);
            else {
                return ReactiveSecurityContextHolder.getContext()
                        .map(SecurityContext::getAuthentication)
                        .filter(Authentication::isAuthenticated)
                        .map(UsernamePasswordAuthenticationToken.class::cast)
                        .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                        .flatMap(ids -> themeRepo.save(themeConverter.deconvert(data))
                                    .flatMap(theme -> themeMemberRepoRelation.save(ThemeMemberRel.builder()
                                            .parent(theme.getId())
                                            .child(ids)
                                            .isActive(0)
                                            .build()).thenReturn(theme))
                        ).map(themeConverter::convertTo);
            }
        }
    }

    @Override
    public Mono<Boolean> addNewTheme(UUID theme) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> themeMemberRepoRelation.save(ThemeMemberRel.builder()
                        .parent(theme).child(item).isActive(0).build())
                ).hasElement();
    }

    @Override
    public Mono<Void> removeTheme(UUID theme) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> themeMemberRepoRelation.findByParentAndChild(theme,item)
                        .switchIfEmpty(Mono.error(new IllegalStateException("Your does`nt have this theme")))
                        .flatMap(data -> themeMemberRepoRelation.deleteByParentAndChild(theme,item)));
    }

    @Override
    public Mono<Void> deleteById(UUID uuid) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> themeMemberRepoRelation.findByParentAndChild(uuid,item))
                .switchIfEmpty(Mono.error(new IllegalStateException("Your not does`nt have this theme")))
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
