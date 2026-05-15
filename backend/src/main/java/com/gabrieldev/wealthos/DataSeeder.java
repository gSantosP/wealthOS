package com.gabrieldev.wealthos;

import com.gabrieldev.wealthos.model.*;
import com.gabrieldev.wealthos.model.Transaction.Category;
import com.gabrieldev.wealthos.model.Transaction.TransactionType;
import com.gabrieldev.wealthos.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private static final UUID DEMO_USER_ID =
        UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final UserRepository        userRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository      budgetRepository;
    private final GoalRepository        goalRepository;
    private final PasswordEncoder       passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.existsById(DEMO_USER_ID)) {
            log.info("Demo data already present — skipping seed.");
            return;
        }

        log.info("Seeding demo data...");

        // ── Demo user ──────────────────────────────────────
        User user = User.builder()
            .id(DEMO_USER_ID)
            .name("Gabriel Santos")
            .email("demo@wealthos.app")
            .passwordHash(passwordEncoder.encode("demo123"))
            .build();
        userRepository.save(user);

        // ── Transactions ───────────────────────────────────
        LocalDate today = LocalDate.now();
        List<Transaction> txs = List.of(
            tx("Netflix",               "🎬", 15.99,   TransactionType.DEBIT,  Category.ENTERTAINMENT, today),
            tx("Salary — Upwork",       "💼", 3200.00, TransactionType.CREDIT, Category.INCOME,        today),
            tx("Pao de Acucar",         "🛒", 187.40,  TransactionType.DEBIT,  Category.FOOD,          today.minusDays(1)),
            tx("Uber",                  "🚗", 23.50,   TransactionType.DEBIT,  Category.TRANSPORT,     today.minusDays(1)),
            tx("Electricity",           "⚡", 142.00,  TransactionType.DEBIT,  Category.HOUSING,       today.minusDays(2)),
            tx("Freelance — React App", "💻", 1400.00, TransactionType.CREDIT, Category.INCOME,        today.minusDays(3)),
            tx("iFood",                 "🍔", 67.90,   TransactionType.DEBIT,  Category.FOOD,          today.minusDays(3)),
            tx("Spotify",               "🎵", 9.90,    TransactionType.DEBIT,  Category.ENTERTAINMENT, today.minusDays(4)),
            tx("Gym membership",        "🏋", 89.90,   TransactionType.DEBIT,  Category.HEALTH,        today.minusDays(5)),
            tx("Zara",                  "👕", 189.90,  TransactionType.DEBIT,  Category.SHOPPING,      today.minusDays(6)),
            tx("Internet — Vivo",       "🌐", 99.90,   TransactionType.DEBIT,  Category.HOUSING,       today.minusDays(7)),
            tx("Freelance — Dashboard", "💻", 2000.00, TransactionType.CREDIT, Category.INCOME,        today.minusDays(8)),
            tx("Farmacia",              "💊", 31.00,   TransactionType.DEBIT,  Category.HEALTH,        today.minusDays(9)),
            tx("Rent",                  "🏠", 1200.00, TransactionType.DEBIT,  Category.HOUSING,       today.minusDays(13)),
            tx("Shell — Gas",           "⛽", 85.00,   TransactionType.DEBIT,  Category.TRANSPORT,     today.minusDays(14))
        );
        transactionRepository.saveAll(txs);

        // ── Budgets ────────────────────────────────────────
        List<Budget> budgets = List.of(
            budget(Category.FOOD,          "🍽", 750.00, 680.00),
            budget(Category.TRANSPORT,     "🚗", 500.00, 420.00),
            budget(Category.ENTERTAINMENT, "🎮", 300.00, 340.00),
            budget(Category.SHOPPING,      "🛍", 600.00, 280.00),
            budget(Category.HEALTH,        "💊", 400.00, 120.00)
        );
        budgetRepository.saveAll(budgets);

        // ── Goals ──────────────────────────────────────────
        List<SavingsGoal> goals = List.of(
            goal("Travel Fund",       "✈",  5000.00,  3400.00),
            goal("Home Down Payment", "🏠", 80000.00, 33600.00),
            goal("New Car",           "🚗", 40000.00, 34000.00),
            goal("Emergency Fund",    "📈", 20000.00, 20000.00)
        );
        goalRepository.saveAll(goals);

        log.info("Demo data seeded successfully. Login: demo@wealthos.app / demo123");
    }

    private Transaction tx(String name, String emoji, double amount,
                           TransactionType type, Category cat, LocalDate date) {
        return Transaction.builder()
            .userId(DEMO_USER_ID)
            .name(name).emoji(emoji)
            .amount(BigDecimal.valueOf(amount))
            .type(type).category(cat).date(date)
            .build();
    }

    private Budget budget(Category cat, String emoji, double limit, double spent) {
        return Budget.builder()
            .userId(DEMO_USER_ID)
            .category(cat).emoji(emoji)
            .limit(BigDecimal.valueOf(limit))
            .spent(BigDecimal.valueOf(spent))
            .build();
    }

    private SavingsGoal goal(String name, String emoji, double target, double current) {
        return SavingsGoal.builder()
            .userId(DEMO_USER_ID)
            .name(name).emoji(emoji)
            .target(BigDecimal.valueOf(target))
            .current(BigDecimal.valueOf(current))
            .build();
    }
}
