package com.amrtm.mynoteapps.entity.other.utils;

public class Tuple4<T1,T2,T3,T4> {
    private T1 t1;
    private T2 t2;
    private T3 t3;
    private T4 t4;

    public Tuple4(T1 t1, T2 t2, T3 t3, T4 t4) {
        this.t1 = t1;
        this.t2 = t2;
        this.t3 = t3;
        this.t4 = t4;
    }

    public T1 getT1() {
        return t1;
    }

    public void setT1(T1 t1) {
        this.t1 = t1;
    }

    public T2 getT2() {
        return t2;
    }

    public void setT2(T2 t2) {
        this.t2 = t2;
    }

    public T3 getT3() {
        return t3;
    }

    public void setT3(T3 t3) {
        this.t3 = t3;
    }

    public T4 getT4() {
        return t4;
    }

    public void setT4(T4 t4) {
        this.t4 = t4;
    }
}
