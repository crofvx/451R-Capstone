package capstone.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import capstone.backend.entity.Budget;
import capstone.backend.repository.BudgetRepository;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {
	@Mock
	private BudgetRepository budgetRepository;

	@InjectMocks
	private BudgetService budgetService;

	private UUID sampleUserId;
	private UUID sampleBudgetId;
	private Budget sampleBudget;

	@BeforeEach
	void setUp() {
		sampleUserId = UUID.randomUUID();
		sampleBudgetId = UUID.randomUUID();
		sampleBudget = new Budget("housing", 6, 2025, new BigDecimal(1000.00), sampleUserId);
		sampleBudget.setBudgetId(sampleBudgetId);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when a budget already exists for the same category and month")
	void createBudget_budgetAlreadyExists_throwsException() {
		/* Arrange */
		Budget budgetToCreate = new Budget("housing", 6, 2025, new BigDecimal(500.00), sampleUserId);
		Budget existingBudget = sampleBudget;

		// Mock finding the budget to return existing budget
		when(budgetRepository.findByUserIdAndCategoryAndMonthAndYear(budgetToCreate.getUserId(),
				budgetToCreate.getCategory(), budgetToCreate.getMonth(), budgetToCreate.getYear()))
				.thenReturn(Optional.of(existingBudget));

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			budgetService.createBudget(budgetToCreate);
		}, "Should throw IllegalArgumentException when budget already exists");

		String expectedErrorMessage = "A budget already exists for this category and month";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify budget repository call
		verify(budgetRepository, times(1)).findByUserIdAndCategoryAndMonthAndYear(budgetToCreate.getUserId(),
				budgetToCreate.getCategory(), budgetToCreate.getMonth(), budgetToCreate.getYear());

		// Verify no other interactions
		verifyNoMoreInteractions(budgetRepository);
	}

	@Test
	@DisplayName("Should create a budget when none exists for the same category and month")
	void createBudget_success() {
		/* Arrange */
		Budget budgetToCreate = new Budget("food", 6, 2025, new BigDecimal(150.00), sampleUserId);

		// Mock finding the budget to return empty
		when(budgetRepository.findByUserIdAndCategoryAndMonthAndYear(budgetToCreate.getUserId(),
				budgetToCreate.getCategory(), budgetToCreate.getMonth(), budgetToCreate.getYear()))
				.thenReturn(Optional.empty());

		// Mock saving the budget
		when(budgetRepository.save(any(Budget.class))).thenReturn(budgetToCreate);

		// Capture arguments passed to findByUserIdAndCategoryAndMonthAndYear
		ArgumentCaptor<UUID> userIdCaptor = ArgumentCaptor.forClass(UUID.class);
		ArgumentCaptor<String> categoryCaptor = ArgumentCaptor.forClass(String.class);
		ArgumentCaptor<Integer> monthCaptor = ArgumentCaptor.forClass(Integer.class);
		ArgumentCaptor<Integer> yearCaptor = ArgumentCaptor.forClass(Integer.class);

		/* Act */
		Budget actualCreatedBudget = budgetService.createBudget(budgetToCreate);

		/* Assert */
		assertNotNull(actualCreatedBudget, "Created budget should not be null");
		assertEquals(budgetToCreate, actualCreatedBudget,
				"The returned budget should be the one saved by the repository");

		// Verify budget repository call
		verify(budgetRepository, times(1)).findByUserIdAndCategoryAndMonthAndYear(userIdCaptor.capture(),
				categoryCaptor.capture(), monthCaptor.capture(), yearCaptor.capture());
		verify(budgetRepository, times(1)).save(budgetToCreate);

		// Verify created budget details
		assertEquals(budgetToCreate.getUserId(), userIdCaptor.getValue(),
				"Captured user ID should match budget user ID");
		assertEquals(budgetToCreate.getCategory(), categoryCaptor.getValue(),
				"Captured category should match budget category");
		assertEquals(budgetToCreate.getMonth(), monthCaptor.getValue(), "Captured month should match budget month");
		assertEquals(budgetToCreate.getYear(), yearCaptor.getValue(), "Captured year should match budget year");

		// Verify no other interactions
		verifyNoMoreInteractions(budgetRepository);
	}

	@Test
	@DisplayName("Should return empty Optional when budget to update is not found")
	void updateBudget_notFound_returnsEmptyOptional() {
		/* Arrange */
		UUID budgetIdToUpdate = UUID.randomUUID();
		Budget budgetToUpdate = new Budget();
		budgetToUpdate.setAllocatedAmount(new BigDecimal(800.00));

		// Mock finding the budget to return empty
		when(budgetRepository.findById(budgetIdToUpdate)).thenReturn(Optional.empty());

		/* Act */
		Optional<Budget> actualUpdatedBudgetOptional = budgetService.updateBudget(budgetIdToUpdate, budgetToUpdate);

		/* Assert */
		assertFalse(actualUpdatedBudgetOptional.isPresent(),
				"Returned Optional should be empty when budget is not found");

		// Verify budget repository call
		verify(budgetRepository, times(1)).findById(budgetIdToUpdate);

		// Verify no other interactions
		verifyNoMoreInteractions(budgetRepository);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when allocated amount is null")
	void updateBudget_allocatedAmountIsNull_throwsException() {
		/* Arrange */
		UUID budgetIdToUpdate = sampleBudgetId;
		Budget budgetToUpdate = new Budget();

		// Mock finding the budget
		when(budgetRepository.findById(budgetIdToUpdate)).thenReturn(Optional.of(sampleBudget));

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			budgetService.updateBudget(budgetIdToUpdate, budgetToUpdate);
		}, "Should throw IllegalArgumentException when allocated amount is null");

		String expectedErrorMessage = "Allocated amount cannot be null when updating the budget.";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify budget repository call
		verify(budgetRepository, times(1)).findById(budgetIdToUpdate);

		// Verify no other interactions
		verifyNoMoreInteractions(budgetRepository);
	}

	@Test
	@DisplayName("Should update the allocated amount of an existing budget")
	void updateBudget_success() {
		/* Arrange */
		UUID budgetIdToUpdate = sampleBudgetId;
		BigDecimal newAllocatedAmount = new BigDecimal(750.00);
		Budget budgetToUpdate = new Budget();
		budgetToUpdate.setAllocatedAmount(newAllocatedAmount);

		// Mock finding the existing budget
		when(budgetRepository.findById(budgetIdToUpdate)).thenReturn(Optional.of(sampleBudget));

		// Mock saving the budget
		when(budgetRepository.save(any(Budget.class))).thenAnswer(invocation -> invocation.getArgument(0));

		/* Act */
		Optional<Budget> actualUpdatedBudgetOptional = budgetService.updateBudget(budgetIdToUpdate, budgetToUpdate);

		/* Assert */
		assertTrue(actualUpdatedBudgetOptional.isPresent(), "Returned Optional should contain the updated budget");
		Budget actualUpdatedBudget = actualUpdatedBudgetOptional.get();

		// Verify updated budget details
		assertNotNull(actualUpdatedBudget, "Updated budget should not be null");
		assertEquals(sampleBudget.getBudgetId(), actualUpdatedBudget.getBudgetId(),
				"Updated budget ID should match original");
		assertTrue(actualUpdatedBudget.getAllocatedAmount().compareTo(newAllocatedAmount) == 0,
				"Updated budget's allocated amount should match the new amount");
		assertEquals(sampleBudget.getCategory(), actualUpdatedBudget.getCategory(),
				"Budget category should not change");
		assertEquals(sampleBudget.getMonth(), actualUpdatedBudget.getMonth(), "Budget month should not change");
		assertEquals(sampleBudget.getYear(), actualUpdatedBudget.getYear(), "Budget year should not change");
		assertEquals(sampleBudget.getUserId(), actualUpdatedBudget.getUserId(), "Budget user ID should not change");

		// Verify budget repository calls
		verify(budgetRepository, times(1)).findById(budgetIdToUpdate);
		verify(budgetRepository, times(1)).save(sampleBudget);

		// Verify no other interactions
		verifyNoMoreInteractions(budgetRepository);
	}

	@Test
	@DisplayName("Should return false if the budget does not exist")
	void deleteBudget_doesNotExist_returnsFalse() {
		/* Arrange */
		UUID budgetIdToDelete = UUID.randomUUID();

		// Mock finding the budget to return false
		when(budgetRepository.existsById(budgetIdToDelete)).thenReturn(false);

		/* Act */
		boolean actualDeleted = budgetService.deleteBudget(budgetIdToDelete);

		/* Assert */
		assertFalse(actualDeleted, "Should return false when budget does not exist");

		// Verify budget repository call
		verify(budgetRepository, times(1)).existsById(budgetIdToDelete);

		// Verify no other interactions
		verifyNoMoreInteractions(budgetRepository);
	}

	@Test
	@DisplayName("Should delete the budget and return true if it exists")
	void deleteBudget_exists_deletesAndReturnsTrue() {
		/* Arrange */
		UUID budgetIdToDelete = sampleBudgetId;

		// Mock finding the budget
		when(budgetRepository.existsById(budgetIdToDelete)).thenReturn(true);

		// Mock deleting the budget
		doNothing().when(budgetRepository).deleteById(budgetIdToDelete);

		/* Act */
		boolean actualDeleted = budgetService.deleteBudget(budgetIdToDelete);

		/* Assert */
		assertTrue(actualDeleted, "Should return true when budget is deleted");

		// Verify budget repository calls
		verify(budgetRepository, times(1)).existsById(budgetIdToDelete);
		verify(budgetRepository, times(1)).deleteById(budgetIdToDelete);

		// Verify no other interactions
		verifyNoMoreInteractions(budgetRepository);
	}

	@Test
	@DisplayName("Should return an empty list when no budgets are found for a given user ID")
	void getBudgetsByUserId_noBudgetsFound_returnsEmptyList() {
		/* Arrange */
		UUID userIdToFind = UUID.randomUUID();
		List<Budget> expectedBudgetsList = List.of();

		// Mock finding the list of budgets to return an empty list
		when(budgetRepository.findByUserId(userIdToFind)).thenReturn(expectedBudgetsList);

		/* Act */
		List<Budget> actualBudgetsList = budgetService.getBudgetsByUserId(userIdToFind);

		/* Assert */
		assertNotNull(actualBudgetsList, "Returned list should not be null (should be empty)");
		assertTrue(actualBudgetsList.isEmpty(), "Returned list should be empty");
		assertEquals(expectedBudgetsList, actualBudgetsList, "Returned list should be the expected empty list");

		// Verify budget repository call
		verify(budgetRepository, times(1)).findByUserId(userIdToFind);

		// Verify no other interactions
		verifyNoMoreInteractions(budgetRepository);
	}

	@Test
	@DisplayName("Should return a list of budgets for a given user ID")
	void getBudgetsByUserId_returnsList() {
		/* Arrange */
		UUID userIdToFind = sampleUserId;
		List<Budget> expectedBudgetsList = Arrays.asList(sampleBudget,
				new Budget("transportation", 10, 2023, new BigDecimal(200.00), userIdToFind));

		// Mock finding the list of budgets
		when(budgetRepository.findByUserId(userIdToFind)).thenReturn(expectedBudgetsList);

		/* Act */
		List<Budget> actualBudgetsList = budgetService.getBudgetsByUserId(userIdToFind);

		/* Assert */
		assertNotNull(actualBudgetsList, "Returned list should not be null");
		assertEquals(expectedBudgetsList.size(), actualBudgetsList.size(), "Returned list size should match");
		assertEquals(expectedBudgetsList, actualBudgetsList, "Returned list should contain the expected budgets");

		// Verify budget repository call
		verify(budgetRepository, times(1)).findByUserId(userIdToFind);

		// Verify no other interactions
		verifyNoMoreInteractions(budgetRepository);
	}
}
