package com.amrtm.mynoteapps.adapter.router.routerfunc.pagingandsorting;

import com.amrtm.mynoteapps.entity.other.utils.Pair;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Arrays;

public class PagingAndSorting {
    public Object asc() {
        return Sort.Direction.ASC;
    }
    public Object desc() {
        return Sort.Direction.DESC;
    }
    public Pageable create(int page, int size, Object sort, String... columnSorted) {
        return PageRequest.of(page,size, (Sort.Direction) sort,columnSorted);
    }
    public Pageable create(int page, int size, Pair<Object,String>... columnSorted) {
        return PageRequest.of(page,size,Sort.by(Arrays.stream(columnSorted).map(item -> {
            if (item.getFirst() == this.asc())
                return Sort.Order.asc(item.getSecond());
            else
                return Sort.Order.desc(item.getSecond());
        }).toList()));
    }
}
