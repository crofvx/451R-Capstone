package capstone.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import capstone.backend.entity.SingleAccountTransaction;
import capstone.backend.repository.SingleAccountTransactionRepository;

@ExtendWith(MockitoExtension.class)
class SingleAccountTransactionServiceTest {
	@Mock
	private SingleAccountTransactionRepository singleAccountTransactionRepository;

	@InjectMocks
	private SingleAccountTransactionService singleAccountTransactionService;

	private SingleAccountTransaction transactionToCreate;

	@BeforeEach
	void setUp() {
		transactionToCreate = new SingleAccountTransaction("deposit", LocalDate.now(), new BigDecimal(50.00),
				"ATM cash deposit", "1234567890123456");
	}

	@Test
	@DisplayName("Should create a single-account transaction and save it using the repository")
	void createTransaction_success() {
		/* Arrange */
		// Mock saving the single-account transaction
		when(singleAccountTransactionRepository.save(any(SingleAccountTransaction.class)))
				.thenReturn(transactionToCreate);

		/* Act */
		SingleAccountTransaction actualCreatedTransaction = singleAccountTransactionService
				.createTransaction(transactionToCreate);

		/* Assert */
		assertNotNull(actualCreatedTransaction, "The created transaction should not be null");
		assertEquals(transactionToCreate, actualCreatedTransaction,
				"The returned transaction should be the one saved by the repository");

		// Verify single-account transaction repository save
		verify(singleAccountTransactionRepository, times(1)).save(any(SingleAccountTransaction.class));
	}
}
