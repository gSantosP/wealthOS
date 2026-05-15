package com.gabrieldev.wealthos.controller;

import com.gabrieldev.wealthos.dto.AiAnalysisRequest;
import com.gabrieldev.wealthos.dto.AiAnalysisResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {

    private final WebClient.Builder webClientBuilder;

    @Value("${anthropic.api-key}")
    private String anthropicApiKey;

    @PostMapping("/analyze")
    public ResponseEntity<AiAnalysisResponse> analyze(
            @Valid @RequestBody AiAnalysisRequest req) {

        String context = buildFinancialContext(req);

        try {
            Map<String, Object> body = Map.of(
                "model",      "claude-sonnet-4-20250514",
                "max_tokens", 800,
                "system",     """
                    You are a sharp, direct personal finance advisor.
                    Give specific, actionable insights — not generic advice.
                    Use exact numbers from the data provided.
                    Format your response with 3-4 sections using a relevant emoji as the header.
                    Be encouraging but honest. No fluff. No disclaimers.
                    """,
                "messages", List.of(Map.of(
                    "role",    "user",
                    "content", "Analyze my finances and give me specific, actionable advice:\n" + context
                ))
            );

            Map<?, ?> response = webClientBuilder.build()
                .post()
                .uri("https://api.anthropic.com/v1/messages")
                .header("x-api-key",         anthropicApiKey)
                .header("anthropic-version", "2023-06-01")
                .header("content-type",      "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

            @SuppressWarnings("unchecked")
            var content = (List<Map<String, String>>) response.get("content");
            String insight = content.get(0).get("text");

            return ResponseEntity.ok(new AiAnalysisResponse(insight));

        } catch (Exception e) {
            log.error("Claude API error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new AiAnalysisResponse("AI service temporarily unavailable."));
        }
    }

    private String buildFinancialContext(AiAnalysisRequest req) {
        StringBuilder sb = new StringBuilder();
        sb.append("Net Worth: $").append(req.getNetWorth()).append("\n");
        sb.append("Monthly Income: $").append(req.getMonthlyIncome()).append("\n");
        sb.append("Monthly Expenses: $").append(req.getMonthlyExpenses()).append("\n");
        sb.append("Savings Rate: ").append(req.getSavingsRate()).append("%\n\n");

        sb.append("Budget Status:\n");
        req.getBudgets().forEach(b -> {
            double pct = b.getSpent().doubleValue() / b.getLimit().doubleValue() * 100;
            sb.append(String.format("- %s: $%.0f / $%.0f (%.0f%%)%s\n",
                b.getCategory(), b.getSpent(), b.getLimit(), pct,
                pct > 100 ? " ⚠ OVER BUDGET" : ""));
        });

        sb.append("\nSavings Goals:\n");
        req.getGoals().forEach(g -> {
            double pct = g.getCurrent().doubleValue() / g.getTarget().doubleValue() * 100;
            sb.append(String.format("- %s %s: %.0f%%\n", g.getEmoji(), g.getName(), pct));
        });

        sb.append("\nTop Spending Categories:\n");
        req.getTopCategories().forEach(c ->
            sb.append(String.format("- %s: $%.0f\n", c.getCategory(), c.getAmount())));

        return sb.toString();
    }
}
