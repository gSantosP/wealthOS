package com.gabrieldev.wealthos.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @AllArgsConstructor @NoArgsConstructor
public class MonthlySnapshotDto {
    private String month;
    private BigDecimal income;
    private BigDecimal expenses;
}
