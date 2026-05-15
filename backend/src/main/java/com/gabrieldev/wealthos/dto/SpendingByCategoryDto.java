package com.gabrieldev.wealthos.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @AllArgsConstructor @NoArgsConstructor
public class SpendingByCategoryDto {
    private String category;
    private BigDecimal amount;
    private String color;
}
