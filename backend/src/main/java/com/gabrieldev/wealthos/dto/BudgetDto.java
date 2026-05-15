package com.gabrieldev.wealthos.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data @AllArgsConstructor @NoArgsConstructor
public class BudgetDto {
    private UUID id;
    private String category;
    private String emoji;
    private BigDecimal limit;
    private BigDecimal spent;
}
