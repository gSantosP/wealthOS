package com.gabrieldev.wealthos.config;

import com.gabrieldev.wealthos.model.*;
import com.gabrieldev.wealthos.model.Transaction.Category;
import com.gabrieldev.wealthos.model.Transaction.TransactionType;
import com.gabrieldev.wealthos.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final TransactionRepository transactionRepo;
    private final BudgetRepository budgetRepo;
    private final GoalRepository goalRepo;

    private static final UUID USER = UUID.fromString("00000000-0000-0000-0000-000000000001");

    @Override
    public void run(String... args) {
        if (transactionRepo.count() > 0) {
            log.info("Data already seeded, skipping");
            return;
        }

        log.info("Seeding demo data...");
        seedTransactions();
        seedBudgets();
        seedGoals();
        log.info("Demo data seeded successfully");
    }

    private void seedTransactions() {
        LocalDate today = LocalDate.now();
        List<Transaction> txs = List.of(
            // Current month income
            tx("Salary — Upwork",     "💼", 3200,  TransactionType.CREDIT, Category.INCOME,        today),
            tx("Freelance — React App","💻", 1400,  TransactionType.CREDIT, Category.INCOME,        today.minusDays(3)),
            tx("Side Project Payment", "🎯", 1600,  TransactionType.CREDIT, Category.INCOME,        today.minusDays(7)),

            // Current month expenses
            tx("Rent",                 "🏠", 1200,  TransactionType.DEBIT,  Category.HOUSING,       today.minusDays(1)),
            tx("Pão de Açúcar",        "🛒", 187.40,TransactionType.DEBIT,  Category.FOOD,          today.minusDays(1)),
            tx("iFood Orders",         "🍔", 245,   TransactionType.DEBIT,  Category.FOOD,          today.minusDays(2)),
            tx("Restaurant",           "🍽️", 147.60,TransactionType.DEBIT,  Category.FOOD,          today.minusDays(5)),
            tx("Grocery",              "🥦", 100,   TransactionType.DEBIT,  Category.FOOD,          today.minusDays(8)),
            tx("Uber",                 "🚗", 23.50, TransactionType.DEBIT,  Category.TRANSPORT,     today.minusDays(1)),
            tx("Gas",                  "⛽", 250,   TransactionType.DEBIT,  Category.TRANSPORT,     today.minusDays(4)),
            tx("Parking",              "🅿️", 46.50, TransactionType.DEBIT,  Category.TRANSPORT,     today.minusDays(6)),
            tx("99 Rides",             "🚘", 100,   TransactionType.DEBIT,  Category.TRANSPORT,     today.minusDays(10)),
            tx("Netflix",              "🎬", 15.99, TransactionType.DEBIT,  Category.ENTERTAINMENT, today.minusDays(1)),
            tx("Spotify",              "🎵", 19.90, TransactionType.DEBIT,  Category.ENTERTAINMENT, today.minusDays(3)),
            tx("Steam Games",          "🎮", 164,   TransactionType.DEBIT,  Category.ENTERTAINMENT, today.minusDays(5)),
            tx("Cinema",               "🍿", 90,    TransactionType.DEBIT,  Category.ENTERTAINMENT, today.minusDays(9)),
            tx("PS Plus",              "🕹️", 50,    TransactionType.DEBIT,  Category.ENTERTAINMENT, today.minusDays(12)),
            tx("Gym",                  "💪", 89.90, TransactionType.DEBIT,  Category.HEALTH,        today.minusDays(2)),
            tx("Pharmacy",             "💊", 30.10, TransactionType.DEBIT,  Category.HEALTH,        today.minusDays(7)),
            tx("Amazon — Monitor Arm", "📦", 156,   TransactionType.DEBIT,  Category.SHOPPING,      today.minusDays(4)),
            tx("Clothes",              "👕", 124,   TransactionType.DEBIT,  Category.SHOPPING,      today.minusDays(8)),
            tx("Electricity",          "⚡", 142,   TransactionType.DEBIT,  Category.HOUSING,       today.minusDays(3)),
            tx("Internet",             "🌐", 99.90, TransactionType.DEBIT,  Category.OTHER,         today.minusDays(5)),
            tx("Phone Plan",           "📱", 59.90, TransactionType.DEBIT,  Category.OTHER,         today.minusDays(5)),

            // Previous months (for chart history)
            tx("Salary",      "💼", 5800,  TransactionType.CREDIT, Category.INCOME, today.minusMonths(1).withDayOfMonth(5)),
            tx("Expenses",    "📊", 4070,  TransactionType.DEBIT,  Category.OTHER,  today.minusMonths(1).withDayOfMonth(15)),
            tx("Salary",      "💼", 5800,  TransactionType.CREDIT, Category.INCOME, today.minusMonths(2).withDayOfMonth(5)),
            tx("Expenses",    "📊", 4070,  TransactionType.DEBIT,  Category.OTHER,  today.minusMonths(2).withDayOfMonth(15)),
            tx("Salary",      "💼", 5400,  TransactionType.CREDIT, Category.INCOME, today.minusMonths(3).withDayOfMonth(5)),
            tx("Expenses",    "📊", 4200,  TransactionType.DEBIT,  Category.OTHER,  today.minusMonths(3).withDayOfMonth(15)),
            tx("Salary",      "💼", 5600,  TransactionType.CREDIT, Category.INCOME, today.minusMonths(4).withDayOfMonth(5)),
            tx("Expenses",    "📊", 3900,  TransactionType.DEBIT,  Category.OTHER,  today.minusMonths(4).withDayOfMonth(15)),
            tx("Salary",      "💼", 5200,  TransactionType.CREDIT, Category.INCOME, today.minusMonths(5).withDayOfMonth(5)),
            tx("Expenses",    "📊", 4100,  TransactionType.DEBIT,  Category.OTHER,  today.minusMonths(5).withDayOfMonth(15))
        );
        transactionRepo.saveAll(txs);
    }

    private void seedBudgets() {
        budgetRepo.saveAll(List.of(
            Budget.builder().userId(USER).category(Category.FOOD)          .emoji("🍽️").limit(bd(750)) .spent(bd(680)).build(),
            Budget.builder().userId(USER).category(Category.TRANSPORT)     .emoji("🚗").limit(bd(500)) .spent(bd(420)).build(),
            Budget.builder().userId(USER).category(Category.ENTERTAINMENT) .emoji("🎮").limit(bd(300)) .spent(bd(340)).build(),
            Budget.builder().userId(USER).category(Category.SHOPPING)      .emoji("🛍️").limit(bd(600)) .spent(bd(280)).build(),
            Budget.builder().userId(USER).category(Category.HEALTH)        .emoji("💊").limit(bd(400)) .spent(bd(120)).build()
        ));
    }

    private void seedGoals() {
        goalRepo.saveAll(List.of(
            SavingsGoal.builder().userId(USER).name("Travel Fund") .emoji("✈️").target(bd(5000)) .current(bd(3400)).build(),
            SavingsGoal.builder().userId(USER).name("Home Down")   .emoji("🏠").target(bd(50000)).current(bd(21000)).build(),
            SavingsGoal.builder().userId(USER).name("New Car")     .emoji("🚗").target(bd(30000)).current(bd(25500)).build(),
            SavingsGoal.builder().userId(USER).name("Emergency")   .emoji("📈").target(bd(10000)).current(bd(10000)).build()
        ));
    }

    private Transaction tx(String name, String emoji, double amt, TransactionType type, Category cat, LocalDate date) {
        return Transaction.builder()
            .userId(USER).name(name).emoji(emoji)
            .amount(BigDecimal.valueOf(amt))
            .type(type).category(cat).date(date)
            .build();
    }

    private BigDecimal bd(double v) { return BigDecimal.valueOf(v); }
}
