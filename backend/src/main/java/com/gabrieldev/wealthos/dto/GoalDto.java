package com.gabrieldev.wealthos.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data @AllArgsConstructor @NoArgsConstructor
public class GoalDto {
    private UUID id;
    private String name;
    private String emoji;
    private BigDecimal target;
    private BigDecimal current;
}
