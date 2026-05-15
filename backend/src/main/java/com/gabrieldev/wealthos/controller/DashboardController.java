package com.gabrieldev.wealthos.controller;

import com.gabrieldev.wealthos.dto.DashboardResponse;
import com.gabrieldev.wealthos.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {
        // TODO: extract userId from JWT SecurityContext
        UUID userId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        return ResponseEntity.ok(dashboardService.getDashboard(userId));
    }
}
