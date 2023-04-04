package com.amrtm.mynoteapps.backend.service.other;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UUIDIdAndName implements IdAndName<UUID> {
    private UUID id;
    private String name;
}
