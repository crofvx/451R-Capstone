package capstone.backend.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
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

import capstone.backend.entity.Account;
import capstone.backend.entity.AccountTransfer;
import capstone.backend.entity.TransferTransaction;
import capstone.backend.repository.AccountRepository;
import capstone.backend.repository.AccountTransferRepository;
import capstone.backend.repository.TransferTransactionRepository;

@ExtendWith(MockitoExtension.class)
class TransferTransactionServiceTest {
	@Mock
	private AccountRepository accountRepository;

	@Mock
	private TransferTransactionRepository transferTransactionRepository;

	@Mock
	private AccountTransferRepository accountTransferRepository;

	@InjectMocks
	private TransferTransactionService transferTransactionService;

	private UUID testUserId;
	private String senderAccountType;
	private String receiverAccountType;
	private BigDecimal transferAmount;

	private Account senderAccount;
	private Account receiverAccount;

	@BeforeEach
	void setUp() {
		testUserId = UUID.randomUUID();
		senderAccountType = "checking";
		receiverAccountType = "saving";
		transferAmount = new BigDecimal(100.00);

		senderAccount = new Account("1234567890123456", senderAccountType, LocalDate.now(), new BigDecimal(500.00),
				testUserId);

		receiverAccount = new Account("0987654321098765", receiverAccountType, LocalDate.now(), new BigDecimal(200.00),
				testUserId);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException if sender and receiver accounts are the same")
	void transferBetweenAccounts_sameAccount_throwsException() {
		/* Arrange */
		String sameAccountType = "checking";
		BigDecimal amount = new BigDecimal(50.00);

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			transferTransactionService.transferBetweenAccounts(testUserId, sameAccountType, sameAccountType, amount);
		}, "Should throw IllegalArgumentException when sender and receiver accounts are the same");

		String expectedErrorMessage = "Sending and receiving accounts must be different";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify that repositories were not accessed
		verifyNoInteractions(accountRepository, transferTransactionRepository, accountTransferRepository);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException if sender account is not found")
	void transferBetweenAccounts_senderNotFound_throwsException() {
		/* Arrange */
		BigDecimal amount = new BigDecimal(50.00);

		// Mock finding the sender account to return empty
		when(accountRepository.findByUserIdAndAccountType(testUserId, senderAccountType)).thenReturn(Optional.empty());
		// Mock finding the receiver account
		when(accountRepository.findByUserIdAndAccountType(testUserId, receiverAccountType))
				.thenReturn(Optional.of(receiverAccount));

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			transferTransactionService.transferBetweenAccounts(testUserId, senderAccountType, receiverAccountType,
					amount);
		}, "Should throw IllegalArgumentException when sender account is not found");

		String expectedErrorMessage = "One or both accounts not found";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify account repository calls
		verify(accountRepository, times(1)).findByUserIdAndAccountType(testUserId, senderAccountType);
		verify(accountRepository, times(1)).findByUserIdAndAccountType(testUserId, receiverAccountType);

		// Verify other repositories were not accessed
		verifyNoMoreInteractions(accountRepository);
		verifyNoInteractions(transferTransactionRepository, accountTransferRepository);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException if receiver account is not found")
	void transferBetweenAccounts_receiverNotFound_throwsException() {
		/* Arrange */
		BigDecimal amount = new BigDecimal(50.00);

		// Mock finding the sender account
		when(accountRepository.findByUserIdAndAccountType(testUserId, senderAccountType))
				.thenReturn(Optional.of(senderAccount));
		// Mock finding the receiver account to return empty
		when(accountRepository.findByUserIdAndAccountType(testUserId, receiverAccountType))
				.thenReturn(Optional.empty());

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			transferTransactionService.transferBetweenAccounts(testUserId, senderAccountType, receiverAccountType,
					amount);
		}, "Should throw IllegalArgumentException when receiver account is not found");

		String expectedErrorMessage = "One or both accounts not found";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify account repository calls
		verify(accountRepository, times(1)).findByUserIdAndAccountType(testUserId, senderAccountType);
		verify(accountRepository, times(1)).findByUserIdAndAccountType(testUserId, receiverAccountType);

		// Verify other repositories were not accessed
		verifyNoMoreInteractions(accountRepository);
		verifyNoInteractions(transferTransactionRepository, accountTransferRepository);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException if sender account has insufficient funds")
	void transferBetweenAccounts_insufficientFunds_throwsException() {
		/* Arrange */
		BigDecimal amountGreaterThanBalance = senderAccount.getBalance().add(new BigDecimal(1.00));

		// Mock finding the sending and receiving accounts
		when(accountRepository.findByUserIdAndAccountType(testUserId, senderAccountType))
				.thenReturn(Optional.of(senderAccount));
		when(accountRepository.findByUserIdAndAccountType(testUserId, receiverAccountType))
				.thenReturn(Optional.of(receiverAccount));

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			transferTransactionService.transferBetweenAccounts(testUserId, senderAccountType, receiverAccountType,
					amountGreaterThanBalance);
		}, "Should throw IllegalArgumentException when sender has insufficient funds");

		String expectedErrorMessage = "Insufficient funds in the sending account";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify account repository calls
		verify(accountRepository, times(1)).findByUserIdAndAccountType(testUserId, senderAccountType);
		verify(accountRepository, times(1)).findByUserIdAndAccountType(testUserId, receiverAccountType);

		// Verify other repositories were not accessed
		verifyNoMoreInteractions(accountRepository);
		verifyNoInteractions(transferTransactionRepository, accountTransferRepository);
	}

	@Test
	@DisplayName("Should transfer funds and record transaction details")
	void transferBetweenAccounts_success() {
		/* Arrange */
		BigDecimal expectedSenderBalanceAfter = senderAccount.getBalance().subtract(transferAmount);
		BigDecimal expectedReceiverBalanceAfter = receiverAccount.getBalance().add(transferAmount);
		UUID expectedTransferTransactionId = UUID.randomUUID();

		// Mock finding the sending and receiving accounts
		when(accountRepository.findByUserIdAndAccountType(testUserId, senderAccountType))
				.thenReturn(Optional.of(senderAccount));
		when(accountRepository.findByUserIdAndAccountType(testUserId, receiverAccountType))
				.thenReturn(Optional.of(receiverAccount));
		// Mock saving the sending and receiving accounts
		when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));

		// Mock saving the transfer transaction
		when(transferTransactionRepository.save(any(TransferTransaction.class))).thenAnswer(invocation -> {
			TransferTransaction savedTransaction = invocation.getArgument(0);
			savedTransaction.setTransactionId(expectedTransferTransactionId);
			return savedTransaction;
		});

		// Mock saving the account transfer details
		when(accountTransferRepository.save(any(AccountTransfer.class)))
				.thenAnswer(invocation -> invocation.getArgument(0));

		// Capture arguments passed to save methods
		ArgumentCaptor<Account> accountCaptor = ArgumentCaptor.forClass(Account.class);
		ArgumentCaptor<TransferTransaction> transferTransactionCaptor = ArgumentCaptor
				.forClass(TransferTransaction.class);
		ArgumentCaptor<AccountTransfer> accountTransferCaptor = ArgumentCaptor.forClass(AccountTransfer.class);

		/* Act */
		assertDoesNotThrow(() -> transferTransactionService.transferBetweenAccounts(testUserId, senderAccountType,
				receiverAccountType, transferAmount), "Transfer should complete without throwing an exception");

		/* Assert */
		// Verify account balance updates
		assertEquals(expectedSenderBalanceAfter, senderAccount.getBalance(),
				"Sender balance should be decreased by transfer amount");
		assertEquals(expectedReceiverBalanceAfter, receiverAccount.getBalance(),
				"Receiver balance should be increased by transfer amount");

		// Verify account repository calls
		verify(accountRepository, times(2)).save(accountCaptor.capture());
		// Verify saved accounts were the sending and receiving accounts
		assertEquals(2, accountCaptor.getAllValues().size(), "Two accounts should have been saved");
		assertTrue(accountCaptor.getAllValues().contains(senderAccount), "Sender account should have been saved");
		assertTrue(accountCaptor.getAllValues().contains(receiverAccount), "Receiver account should have been saved");

		// Verify transfer transaction repository calls
		verify(transferTransactionRepository, times(1)).save(transferTransactionCaptor.capture());

		TransferTransaction actualCreatedTransferTransaction = transferTransactionCaptor.getValue();

		// Verify transfer transaction creation details
		assertNotNull(actualCreatedTransferTransaction, "The created transfer transaction should not be null");
		assertEquals(transferAmount, actualCreatedTransferTransaction.getTransactionAmount(),
				"Transfer transaction amount should match");
		assertEquals(LocalDate.now(), actualCreatedTransferTransaction.getTransactionDate(),
				"Transfer transaction date should be today");
		String expectedDescription = "Transferred $" + transferAmount + " from account " + senderAccount.getAccountNo()
				+ " to account " + receiverAccount.getAccountNo();
		assertTrue(actualCreatedTransferTransaction.getDescription().equals(expectedDescription),
				"Transfer transaction description should match");

		// Verify account transfer repository calls
		verify(accountTransferRepository, times(2)).save(accountTransferCaptor.capture());
		assertEquals(2, accountTransferCaptor.getAllValues().size(), "Two account transfers should have been saved");

		AccountTransfer transferSender = accountTransferCaptor.getAllValues().stream()
				.filter(at -> "sender".equals(at.getRole())).findFirst().orElse(null);
		AccountTransfer transferReceiver = accountTransferCaptor.getAllValues().stream()
				.filter(at -> "receiver".equals(at.getRole())).findFirst().orElse(null);

		// Verify account transfer creation details
		assertNotNull(transferSender, "The created account transfer for the sender should not be null");
		assertNotNull(transferReceiver, "The created account transfer for the receiver should not be null");
		assertEquals(senderAccount.getAccountNo(), transferSender.getAccountNo(),
				"Account transfer sender account number should match sender account");
		assertEquals(receiverAccount.getAccountNo(), transferReceiver.getAccountNo(),
				"Account transfer receiver account number should match receiver account");
		assertEquals(expectedTransferTransactionId, transferSender.getTransactionId(),
				"Account transfer sender should link to the transfer transaction ID");
		assertEquals(expectedTransferTransactionId, transferReceiver.getTransactionId(),
				"Account transfer receiver should link to the transfer transaction ID");
		assertEquals("sender", transferSender.getRole(), "Account transfer sender role should be 'sender'");
		assertEquals("receiver", transferReceiver.getRole(), "Account transfer receiver role should be 'receiver'");

		// Verify no other interactions occurred with the repositories
		verifyNoMoreInteractions(accountRepository, transferTransactionRepository, accountTransferRepository);
	}
}
