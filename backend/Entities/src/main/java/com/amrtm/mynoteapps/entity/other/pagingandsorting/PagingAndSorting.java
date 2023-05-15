package com.amrtm.mynoteapps.entity.other.pagingandsorting;

import com.amrtm.mynoteapps.entity.other.utils.Pair;

public interface PagingAndSorting<Pageable> {
    Object asc();
    Object desc();
    Pageable create(int page, int size, Object sort, String... columnSorted);
    Pageable create(int page, int size, Pair<Object,String>... columnSorted);
}
