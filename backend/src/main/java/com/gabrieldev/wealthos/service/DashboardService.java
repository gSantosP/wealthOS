package com.gabrieldev.wealthos.service;

import com.gabrieldev.wealthos.dto.*;
import com.gabrieldev.wealthos.model.Transaction;
import com.gabrieldev.wealthos.model.Transaction.TransactionType;
import com.gabrieldev.wealthos.repository.TransactionRepository;
import com.gabrieldev.wealthos.repository.BudgetRepository;
import com.gabrieldev.wealthos.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository      budgetRepository;
    private final GoalRepository        goalRepository;

    private static final Map<Transaction.Category, String> CATEGORY_COLORS = Map.of(
        Transaction.Category.HOUSING,       "#6366f1",
        Transaction.Category.FOOD,          "#10b981",
        Transaction.Category.TRANSPORT,     "#f59e0b",
        Transaction.Category.ENTERTAINMENT, "#06b6d4",
        Transaction.Category.HEALTH,        "#a78bfa",
        Transaction.Category.SHOPPING,      "#f43f5e",
        Transaction.Category.OTHER,         "#64748b"
    );

    public DashboardResponse getDashboard(UUID userId) {
        LocalDate now      = LocalDate.now();
        LocalDate start    = now.withDayOfMonth(1);
        LocalDate lastStart = start.minusMonths(1);

        List<Transaction> thisMonth = transactionRepository
            .findByUserIdAndDateBetween(userId, start, now);
        List<Transaction> lastMonth = transactionRepository
            .findByUserIdAndDateBetween(userId, lastStart, start.minusDays(1));

        BigDecimal income   = sumByType(thisMonth, TransactionType.CREDIT);
        BigDecimal expenses = sumByType(thisMonth, TransactionType.DEBIT);
        BigDecimal lastInc  = sumByType(lastMonth, TransactionType.CREDIT);
        BigDecimal lastExp  = sumByType(lastMonth, TransactionType.DEBIT);

        BigDecimal savingsRate = income.compareTo(BigDecimal.ZERO) > 0
            ? income.subtract(expenses).divide(income, 4, RoundingMode.HALF_UP)
              .multiply(BigDecimal.valueOf(100)).setScale(1, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        // Net worth (simplified: sum all credits minus debits ever)
        List<Transaction> all = transactionRepository.findByUserId(userId);
        BigDecimal netWorth   = sumByType(all, TransactionType.CREDIT)
                                .subtract(sumByType(all, TransactionType.DEBIT));
        BigDecimal prevNetWorth = netWorth.subtract(income).add(expenses);
        BigDecimal netWorthChange = netWorth.subtract(prevNetWorth);

        // 6-month history
        List<MonthlySnapshotDto> history = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym   = YearMonth.from(now).minusMonths(i);
            LocalDate ms   = ym.atDay(1);
            LocalDate me   = ym.atEndOfMonth();
            List<Transaction> monthTxs = transactionRepository
                .findByUserIdAndDateBetween(userId, ms, me);
            history.add(new MonthlySnapshotDto(
                ym.getMonth().name().substring(0,3),
                sumByType(monthTxs, TransactionType.CREDIT),
                sumByType(monthTxs, TransactionType.DEBIT)
            ));
        }

        // Spending by category
        Map<Transaction.Category, BigDecimal> byCat = thisMonth.stream()
            .filter(t -> t.getType() == TransactionType.DEBIT)
            .collect(Collectors.groupingBy(
                Transaction::getCategory,
                Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
            ));

        List<SpendingByCategoryDto> byCategory = byCat.entrySet().stream()
            .sorted(Map.Entry.<Transaction.Category, BigDecimal>comparingByValue().reversed())
            .map(e -> new SpendingByCategoryDto(
                e.getKey().name(),
                e.getValue(),
                CATEGORY_COLORS.getOrDefault(e.getKey(), "#64748b")
            ))
            .collect(Collectors.toList());

        return DashboardResponse.builder()
            .netWorth(netWorth)
            .netWorthChange(netWorthChange)
            .monthlyIncome(income)
            .incomeChange(income.subtract(lastInc))
            .monthlyExpenses(expenses)
            .expensesChange(expenses.subtract(lastExp))
            .savingsRate(savingsRate)
            .liquidAssets(netWorth.multiply(BigDecimal.valueOf(0.27)))
            .investments(netWorth.multiply(BigDecimal.valueOf(0.63)))
            .realEstate(netWorth.multiply(BigDecimal.valueOf(0.10)))
            .cashFlow(income.subtract(expenses))
            .history(history)
            .byCategory(byCategory)
            .transactions(transactionRepository.findTop20ByUserIdOrderByDateDesc(userId)
                .stream().map(this::toDto).collect(Collectors.toList()))
            .budgets(budgetRepository.findByUserId(userId).stream()
                .map(b -> new BudgetDto(b.getId(), b.getCategory().name(),
                    b.getEmoji(), b.getLimit(), b.getSpent()))
                .collect(Collectors.toList()))
            .goals(goalRepository.findByUserId(userId).stream()
                .map(g -> new GoalDto(g.getId(), g.getName(), g.getEmoji(),
                    g.getTarget(), g.getCurrent()))
                .collect(Collectors.toList()))
            .build();
    }

    private BigDecimal sumByType(List<Transaction> txs, TransactionType type) {
        return txs.stream()
            .filter(t -> t.getType() == type)
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private TransactionDto toDto(Transaction t) {
        return new TransactionDto(
            t.getId().toString(), t.getName(), t.getEmoji(),
            t.getAmount(), t.getType().name().toLowerCase(),
            t.getCategory().name(), t.getDate().toString()
        );
    }
}
