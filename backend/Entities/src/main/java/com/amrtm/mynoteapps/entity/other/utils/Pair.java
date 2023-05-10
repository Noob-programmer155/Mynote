package com.amrtm.mynoteapps.entity.other.utils;

public class Pair<T,D> {
    T first;
    D second;

    public Pair() {
    }

    public Pair(T first, D second) {
        this.first = first;
        this.second = second;
    }

    public static <A,B> Pair<A,B> of(A par1, B par2) {
        return new Pair<>(par1,par2);
    }

    public T getFirst() {
        return first;
    }

    public void setFirst(T first) {
        this.first = first;
    }

    public D getSecond() {
        return second;
    }

    public void setSecond(D second) {
        this.second = second;
    }
}
