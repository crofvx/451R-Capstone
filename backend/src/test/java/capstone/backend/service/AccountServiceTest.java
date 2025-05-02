package capstone.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import capstone.backend.entity.Account;
import capstone.backend.repository.AccountRepository;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {
	@Mock
	private AccountRepository accountRepository;

	@InjectMocks
	private AccountService accountService;

	private Account accountToCreate;

	@BeforeEach
	void setUp() {
		accountToCreate = new Account("saving", LocalDate.now(), new BigDecimal(1000.00), UUID.randomUUID());
	}

	@Test
	@DisplayName("Should create an account and save it using the repository")
	void createAccount_success() {
		/* Arrange */
		// Mock saving the account
		when(accountRepository.save(any(Account.class))).thenReturn(accountToCreate);

		/* Act */
		Account actualCreatedAccount = accountService.createAccount(accountToCreate);

		/* Assert */
		assertNotNull(actualCreatedAccount, "The created account should not be null");
		assertEquals(accountToCreate, actualCreatedAccount,
				"The returned account should be the one saved by the repository");

		// Verify account repository save
		verify(accountRepository, times(1)).save(any(Account.class));
	}

	@Test
	@DisplayName("Should generate a 16-digit account number")
	void generateAccountNo_returns16Digits() {
		/* Arrange */
		// Mock existsById to always return false, ensuring the loop runs only once
		when(accountRepository.existsById(anyString())).thenReturn(false);

		/* Act */
		String actualGeneratedAccountNo = accountService.generateAccountNo();

		/* Assert */
		assertNotNull(actualGeneratedAccountNo, "Generated account number should not be null");
		assertEquals(16, actualGeneratedAccountNo.length(), "Generated account number should be 16 digits long");
		assertTrue(actualGeneratedAccountNo.matches("\\d{16}"), "Generated account number should contain only digits");

		// Verify account repository call
		verify(accountRepository, atLeastOnce()).existsById(anyString());
	}

	@Test
	@DisplayName("Should generate a random balance within the specified valid range")
	void generateRandomBalance_withinRange() {
		/* Arrange */
		long min = 500L;
		long max = 5000L;

		/* Act */
		long actualRandomBalance = accountService.generateRandomBalance(min, max);

		/* Assert */
		assertTrue(actualRandomBalance >= min && actualRandomBalance <= max,
				"Generated balance should be within the inclusive range [" + min + ", " + max + "]");
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when min is greater than max for generateRandomBalance")
	void generateRandomBalance_minGreaterThanMax_throwsException() {
		/* Arrange */
		long min = 2000L;
		long max = 1000L;

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			accountService.generateRandomBalance(min, max);
		}, "Should throw IllegalArgumentException when min > max");

		String expectedErrorMessage = "min must be less than max";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when min equals max for generateRandomBalance")
	void generateRandomBalance_minEqualsMax_throwsException() {
		/* Arrange */
		long min = 1500L;
		long max = 1500L;

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			accountService.generateRandomBalance(min, max);
		}, "Should throw IllegalArgumentException when min == max");

		String expectedErrorMessage = "min must be less than max";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");
	}
}
