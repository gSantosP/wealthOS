package com.gabrieldev.wealthos.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "budgets")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Transaction.Category category;

    private String emoji;

    @Column(name = "budget_limit", nullable = false, precision = 10, scale = 2)
    private BigDecimal limit;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal spent;
}
