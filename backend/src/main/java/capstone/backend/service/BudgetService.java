package capstone.backend.service;

import capstone.backend.entity.Budget;
import capstone.backend.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;import java.util.List;



@Service
public class BudgetService {
    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }
    
    

    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public Optional<Budget> updateBudget(UUID id, Budget budgetDetails) {
        return budgetRepository.findById(id).map(existingBudget -> {
            if (budgetDetails.getAllocatedAmount() != null) {
                existingBudget.setAllocatedAmount(budgetDetails.getAllocatedAmount());
                return budgetRepository.save(existingBudget);
            } else {
                throw new IllegalArgumentException("Allocated amount cannot be null when updating the budget.");
            }
        });
    }

    public boolean deleteBudget(UUID id) {
        if (budgetRepository.existsById(id)) {
            budgetRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<Budget> getBudgetsByUserId(UUID userId) {
        return budgetRepository.findByUserId(userId);
    }
}
