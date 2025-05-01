package capstone.backend.controller;

import capstone.backend.entity.Budget;
import capstone.backend.service.BudgetService;
import capstone.backend.utils.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetService budgetService;
    private final JwtUtils jwtUtils;

    public BudgetController(BudgetService budgetService, JwtUtils jwtUtils) {
        this.budgetService = budgetService;
        this.jwtUtils = jwtUtils;
    }

    // ✅ Create a new budget
    @PostMapping
    public ResponseEntity<Object> createBudget(
            @RequestHeader(name = "Authorization", required = false) String authHeader,
            @RequestBody Budget budget) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                UUID userId = UUID.fromString(jwtUtils.extractUserId(token));

                if (userId != null) {
                    budget.setUserId(userId);  // Attach user ID to the budget!
                    Budget createdBudget = budgetService.createBudget(budget);
                    return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
                } else {
                    return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create budget"));
        }
    }

    // ✅ Edit (update) an existing budget
    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable UUID id, @RequestBody Budget budgetDetails) {
        Optional<Budget> updatedBudget = budgetService.updateBudget(id, budgetDetails);
        return updatedBudget
                .map(budget -> new ResponseEntity<>(budget, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // ✅ Delete a budget
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable UUID id) {
        boolean deleted = budgetService.deleteBudget(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets(
            @RequestHeader(name = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                UUID userId = UUID.fromString(jwtUtils.extractUserId(token));

                if (userId != null) {
                    List<Budget> budgets = budgetService.getBudgetsByUserId(userId);
                    return ResponseEntity.ok(budgets);
                } else {
                    return ResponseEntity.badRequest().build();
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
