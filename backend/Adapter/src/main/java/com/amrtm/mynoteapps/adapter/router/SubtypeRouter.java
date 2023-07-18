package com.amrtm.mynoteapps.adapter.router;

import com.amrtm.mynoteapps.entity.other.utils.SingleData;
import com.amrtm.mynoteapps.entity.model.subtype.impl.SubtypeDTO;
import com.amrtm.mynoteapps.usecase.subtype.SubtypeService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public class SubtypeRouter<PagingAndSorting> {
    private final SubtypeService<PagingAndSorting> subtypeService;
    private final com.amrtm.mynoteapps.entity.other.pagingandsorting.PagingAndSorting<PagingAndSorting> pagingAndSorting;

    public SubtypeRouter(SubtypeService<PagingAndSorting> subtypeService, com.amrtm.mynoteapps.entity.other.pagingandsorting.PagingAndSorting<PagingAndSorting> pagingAndSorting) {
        this.subtypeService = subtypeService;
        this.pagingAndSorting = pagingAndSorting;
    }

    public Flux<SubtypeDTO> getByGroup(UUID group) {
        return subtypeService.findByGroup(group);
    }

    public Flux<SubtypeDTO> searchByName(String name, int page, int size) {
        return subtypeService.findByName(name, pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Mono<SingleData<Boolean>> updateIndex(Integer indexFrom, Integer indexTo, UUID subtypeFrom, UUID subtypeTo, UUID group) {
        return subtypeService.updateIndex(indexFrom,indexTo,subtypeFrom,subtypeTo,group).map(SingleData::new);
    }

    public Mono<SubtypeDTO> update(Integer index,UUID oldSubtype,SubtypeDTO newSubtype, UUID group) {
        return subtypeService.updateSubtype(index,oldSubtype,newSubtype,group);
    }

    public Mono<SubtypeDTO> save(Integer index,SubtypeDTO newSubtype, UUID group) {
        return subtypeService.save(index,newSubtype,group);
    }

    public Mono<SingleData<Boolean>> removeGroup(UUID group, UUID subtype) {
        return subtypeService.removeSubtype(subtype,group).then(Mono.just(new SingleData<>(true)));
    }

    public Mono<SingleData<Boolean>> delete(UUID group, UUID subtype) {
        return subtypeService.deleteById(subtype,group).then(Mono.just(new SingleData<>(true)));
    }
}
