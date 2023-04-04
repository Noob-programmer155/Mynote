package com.amrtm.mynoteapps.backend.configuration.router.other;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SingleData<ID> {
    private ID data;
}
