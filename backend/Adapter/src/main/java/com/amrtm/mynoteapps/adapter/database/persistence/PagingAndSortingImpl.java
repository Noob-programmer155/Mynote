package com.amrtm.mynoteapps.adapter.database.persistence;

import com.amrtm.mynoteapps.entity.other.pagingandsorting.PagingAndSorting;
import com.amrtm.mynoteapps.entity.other.utils.Pair;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Arrays;
import java.util.List;

public class PagingAndSortingImpl implements PagingAndSorting<Pageable> {
    @Override
    public Object asc() {
        return Sort.Direction.ASC;
    }

    @Override
    public Object desc() {
        return Sort.Direction.DESC;
    }

    @Override
    public Pageable create(int page, int size, Object sort, String... columnSorted) {
        return PageRequest.of(page,size,(Sort.Direction) sort,columnSorted);
    }

    @Override
    public Pageable create(int page, int size, List<Pair<Object, String>> columnSorted) {
        return PageRequest.of(page,size,Sort.by(
                columnSorted.stream().map(item -> {
                    if (item.getFirst() == Sort.Direction.ASC) return Sort.Order.asc(item.getSecond());
                    else return Sort.Order.desc(item.getSecond());
                }).toList()
        ));
    }
}
