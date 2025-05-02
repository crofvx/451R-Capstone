package capstone.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import capstone.backend.entity.Budget;
import capstone.backend.repository.BudgetRepository;
import jakarta.transaction.Transactional;

@Service
public class BudgetService {
	private final BudgetRepository budgetRepository;

	public BudgetService(BudgetRepository budgetRepository) {
		this.budgetRepository = budgetRepository;
	}

	@Transactional
	public Budget createBudget(Budget budget) {
		if (budgetRepository.findByUserIdAndCategoryAndMonthAndYear(budget.getUserId(), budget.getCategory(),
				budget.getMonth(), budget.getYear()).isPresent()) {
			throw new IllegalArgumentException("A budget already exists for this category and month");
		}

		return budgetRepository.save(budget);
	}

	@Transactional
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

	@Transactional
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
