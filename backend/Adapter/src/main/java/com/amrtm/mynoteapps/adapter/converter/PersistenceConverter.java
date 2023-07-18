package com.amrtm.mynoteapps.adapter.converter;

public interface PersistenceConverter<E,T> {
    E toFirst(T from);
    T toSecond(E from);
}
