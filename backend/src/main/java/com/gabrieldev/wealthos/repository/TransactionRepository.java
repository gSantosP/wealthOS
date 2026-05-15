package com.gabrieldev.wealthos.repository;

import com.gabrieldev.wealthos.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    List<Transaction> findByUserId(UUID userId);

    List<Transaction> findByUserIdAndDateBetween(UUID userId, LocalDate start, LocalDate end);

    List<Transaction> findTop20ByUserIdOrderByDateDesc(UUID userId);
}
