package com.amrtm.mynoteapps.entity.other.pagingandsorting;

import com.amrtm.mynoteapps.entity.other.utils.Pair;

import java.util.List;

public interface PagingAndSorting<Pageable> {
    Object asc();
    Object desc();
    Pageable create(int page, int size, Object sort, String... columnSorted);
    Pageable create(int page, int size, List<Pair<Object,String>> columnSorted);
}
