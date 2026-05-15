package com.gabrieldev.wealthos.controller;

import com.gabrieldev.wealthos.model.User;
import com.gabrieldev.wealthos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }
        User user = User.builder()
            .name(req.name())
            .email(req.email())
            .passwordHash(passwordEncoder.encode(req.password()))
            .build();
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return userRepository.findByEmail(req.email())
            .filter(u -> passwordEncoder.matches(req.password(), u.getPasswordHash()))
            .map(u -> ResponseEntity.ok(Map.of(
                "token", "demo-jwt-" + u.getId(),
                "name",  u.getName()
            )))
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }

    record RegisterRequest(String name, String email, String password) {}
    record LoginRequest(String email, String password) {}
}
