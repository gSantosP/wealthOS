package com.gabrieldev.wealthos.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder
public class DashboardResponse {
    private BigDecimal netWorth;
    private BigDecimal netWorthChange;
    private BigDecimal monthlyIncome;
    private BigDecimal incomeChange;
    private BigDecimal monthlyExpenses;
    private BigDecimal expensesChange;
    private BigDecimal savingsRate;
    private BigDecimal liquidAssets;
    private BigDecimal investments;
    private BigDecimal realEstate;
    private BigDecimal cashFlow;
    private List<MonthlySnapshotDto> history;
    private List<SpendingByCategoryDto> byCategory;
    private List<TransactionDto> transactions;
    private List<BudgetDto> budgets;
    private List<GoalDto> goals;
}
