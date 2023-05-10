package com.amrtm.mynoteapps.entity.other.utils;

public class SingleData<ID> {
    private ID data;

    public SingleData() {
    }

    public SingleData(ID data) {
        this.data = data;
    }

    public ID getData() {
        return data;
    }

    public void setData(ID data) {
        this.data = data;
    }
}
