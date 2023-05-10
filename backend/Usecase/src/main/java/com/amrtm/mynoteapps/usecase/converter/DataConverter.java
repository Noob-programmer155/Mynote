package com.amrtm.mynoteapps.usecase.converter;

public interface DataConverter<D,DE> {
    DE convertTo(D data);
    D deconvert(DE data);
    D deconvert(DE data, D entity);
}