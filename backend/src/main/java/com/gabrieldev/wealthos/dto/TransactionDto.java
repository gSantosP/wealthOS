package com.gabrieldev.wealthos.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @AllArgsConstructor @NoArgsConstructor
public class TransactionDto {
    private String id;
    private String name;
    private String emoji;
    private BigDecimal amount;
    private String type;
    private String category;
    private String date;
}
