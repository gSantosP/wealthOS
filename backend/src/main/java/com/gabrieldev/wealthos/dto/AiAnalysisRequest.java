package com.gabrieldev.wealthos.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
public class AiAnalysisRequest {
    private BigDecimal netWorth;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private BigDecimal savingsRate;
    private List<BudgetDto> budgets;
    private List<GoalDto> goals;
    private List<SpendingByCategoryDto> topCategories;
}
