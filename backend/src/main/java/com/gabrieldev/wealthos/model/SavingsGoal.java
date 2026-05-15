package com.gabrieldev.wealthos.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "savings_goals")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SavingsGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String name;

    private String emoji;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal target;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal current;
}
