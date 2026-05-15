package com.gabrieldev.wealthos.controller;

import com.gabrieldev.wealthos.dto.TransactionDto;
import com.gabrieldev.wealthos.model.Transaction;
import com.gabrieldev.wealthos.model.Transaction.Category;
import com.gabrieldev.wealthos.model.Transaction.TransactionType;
import com.gabrieldev.wealthos.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionRepository transactionRepository;

    // Hardcoded demo user
    private static final UUID DEMO_USER = UUID.fromString("00000000-0000-0000-0000-000000000001");

    @GetMapping
    public ResponseEntity<List<TransactionDto>> list() {
        List<TransactionDto> txs = transactionRepository
            .findTop20ByUserIdOrderByDateDesc(DEMO_USER)
            .stream()
            .map(this::toDto)
            .toList();
        return ResponseEntity.ok(txs);
    }

    @PostMapping
    public ResponseEntity<TransactionDto> create(@RequestBody CreateTxRequest req) {
        Transaction tx = Transaction.builder()
            .userId(DEMO_USER)
            .name(req.name)
            .emoji(req.emoji)
            .amount(BigDecimal.valueOf(req.amount))
            .type("credit".equalsIgnoreCase(req.type) ? TransactionType.CREDIT : TransactionType.DEBIT)
            .category(parseCategory(req.category))
            .date(LocalDate.now())
            .build();
        Transaction saved = transactionRepository.save(tx);
        return ResponseEntity.ok(toDto(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        transactionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private TransactionDto toDto(Transaction t) {
        return new TransactionDto(
            t.getId().toString(),
            t.getName(),
            t.getEmoji(),
            t.getAmount(),
            t.getType().name().toLowerCase(),
            t.getCategory().name(),
            t.getDate().toString()
        );
    }

    private Category parseCategory(String cat) {
        try { return Category.valueOf(cat.toUpperCase()); }
        catch (Exception e) { return Category.OTHER; }
    }

    record CreateTxRequest(String name, String emoji, double amount, String type, String category) {}
}
