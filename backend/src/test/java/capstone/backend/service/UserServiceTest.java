package capstone.backend.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
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
import org.springframework.security.crypto.password.PasswordEncoder;

import capstone.backend.entity.Account;
import capstone.backend.entity.PasswordResetToken;
import capstone.backend.entity.SingleAccountTransaction;
import capstone.backend.entity.User;
import capstone.backend.repository.PasswordResetTokenRepository;
import capstone.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
	@Mock
	private UserRepository userRepository;

	@Mock
	private AccountService accountService;

	@Mock
	private SingleAccountTransactionService singleAccountTransactionService;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Mock
	private PasswordResetEmailService passwordResetEmailService;

	@InjectMocks
	private UserService userService;

	private User sampleUser;
	private UUID sampleUserId;
	private String sampleRawPassword;
	private String sampleHashedPassword;

	@BeforeEach
	void setUp() {
		sampleUserId = UUID.randomUUID();
		sampleRawPassword = "password123";
		sampleHashedPassword = "hashedPassword123";
		sampleUser = new User(sampleUserId, "John", "Doe", "john.doe@example.com", "1234567890",
				"123 Main St, Kansas City, MO, 64101", LocalDate.of(1990, 5, 15), sampleHashedPassword);
	}

	@Test
	@DisplayName("Should return true if email is already taken")
	void emailIsTaken_returnsTrueWhenEmailExists() {
		/* Arrange */
		String emailToCheck = "existing@example.com";
		// Mock finding the email to return true
		when(userRepository.existsByEmail(emailToCheck)).thenReturn(true);

		/* Act */
		boolean actualEmailTaken = userService.emailIsTaken(emailToCheck);

		/* Assert */
		assertTrue(actualEmailTaken, "Email should be reported as taken");

		// Verify the user repository call
		verify(userRepository, times(1)).existsByEmail(emailToCheck);
	}

	@Test
	@DisplayName("Should return false if email is not taken")
	void emailIsTaken_returnsFalseWhenEmailDoesNotExist() {
		/* Arrange */
		String emailToCheck = "new@example.com";
		// Mock finding the email to return false
		when(userRepository.existsByEmail(emailToCheck)).thenReturn(false);

		/* Act */
		boolean actualEmailTaken = userService.emailIsTaken(emailToCheck);

		/* Assert */
		assertFalse(actualEmailTaken, "Email should not be reported as taken");

		// Verify the user repository call
		verify(userRepository, times(1)).existsByEmail(emailToCheck);
	}

	@Test
	@DisplayName("Should create user, hash password, and create bank accounts and initial transactions")
	void createUser_success() {
		/* Arrange */
		User userToCreate = new User("Jane", "Doe", "jane.doe@example.com", "0987654321",
				"456 Oak Ave, Kansas City, MO, 64151", LocalDate.of(1992, 8, 20), sampleRawPassword);

		// Mock password encoding
		when(passwordEncoder.encode(sampleRawPassword)).thenReturn(sampleHashedPassword);

		// Mock saving the user with a generated ID
		User savedUserWithId = new User(UUID.randomUUID(), userToCreate.getFirstName(), userToCreate.getLastName(),
				userToCreate.getEmail(), userToCreate.getPhone(), userToCreate.getAddress(),
				userToCreate.getBirthDate(), sampleHashedPassword);
		when(userRepository.save(any(User.class))).thenReturn(savedUserWithId);

		BigDecimal expectedCheckingBalance = new BigDecimal(1000.00);
		BigDecimal expectedSavingBalance = new BigDecimal(3000.00);

		// Mock generating a random account balance
		when(accountService.generateRandomBalance(500, 1500)).thenReturn(expectedCheckingBalance.longValue());
		when(accountService.generateRandomBalance(1000, 5000)).thenReturn(expectedSavingBalance.longValue());

		// Mock creating an account with a generated account number
		doAnswer(invocation -> {
			Account account = invocation.getArgument(0);
			account.setAccountNo(UUID.randomUUID().toString().substring(0, 16));
			return null;
		}).when(accountService).createAccount(any(Account.class));

		// Mock creating a single-account transaction
		when(singleAccountTransactionService.createTransaction(any(SingleAccountTransaction.class)))
				.thenAnswer(invocation -> invocation.getArgument(0));

		// Capture arguments to verify calls to other services
		ArgumentCaptor<Account> accountCaptor = ArgumentCaptor.forClass(Account.class);
		ArgumentCaptor<SingleAccountTransaction> transactionCaptor = ArgumentCaptor
				.forClass(SingleAccountTransaction.class);

		/* Act */
		User actualCreatedUser = userService.createUser(userToCreate);

		/* Assert */
		// Verify user creation details
		assertNotNull(actualCreatedUser, "Created user should not be null");
		assertEquals(savedUserWithId.getUserId(), actualCreatedUser.getUserId(),
				"Created user should have the generated ID");
		assertEquals(sampleHashedPassword, actualCreatedUser.getPassword(), "User's password should be hashed");
		assertEquals(userToCreate.getEmail(), actualCreatedUser.getEmail(), "User email should match");

		// Verify password hashing
		verify(passwordEncoder, times(1)).encode(sampleRawPassword);

		// Verify user repository save
		verify(userRepository, times(1)).save(any(User.class));

		// Verify account service calls
		verify(accountService, times(1)).generateRandomBalance(500, 1500);
		verify(accountService, times(1)).generateRandomBalance(1000, 5000);
		verify(accountService, times(2)).createAccount(accountCaptor.capture());

		// Verify account creation details
		assertEquals(2, accountCaptor.getAllValues().size(), "Two accounts should have been created");
		Account checkingAccountCreated = accountCaptor.getAllValues().stream()
				.filter(acc -> "checking".equals(acc.getAccountType())).findFirst().orElse(null);
		Account savingsAccountCreated = accountCaptor.getAllValues().stream()
				.filter(acc -> "saving".equals(acc.getAccountType())).findFirst().orElse(null);

		assertNotNull(checkingAccountCreated, "Checking account should have been created");
		assertNotNull(savingsAccountCreated, "Savings account should have been created");

		// Verify checking account creation details
		assertEquals(savedUserWithId.getUserId(), checkingAccountCreated.getUserId(),
				"Checking account should be linked to new user ID");
		assertTrue(checkingAccountCreated.getBalance().compareTo(expectedCheckingBalance) == 0,
				"Checking account balance should match generated balance numerically");
		assertEquals(LocalDate.now(), checkingAccountCreated.getCreationDate(),
				"Checking account creation date should be today");
		assertNotNull(checkingAccountCreated.getAccountNo(), "Checking account number should match");

		// Verify savings account creation details
		assertEquals(savedUserWithId.getUserId(), savingsAccountCreated.getUserId(),
				"Savings account should be linked to new user ID");
		assertTrue(savingsAccountCreated.getBalance().compareTo(expectedSavingBalance) == 0,
				"Savings account balance should match generated balance numerically");
		assertEquals(LocalDate.now(), savingsAccountCreated.getCreationDate(),
				"Savings account creation date should be today");
		assertNotNull(savingsAccountCreated.getAccountNo(), "Savings account number should match");

		// Verify single account transaction service calls
		verify(singleAccountTransactionService, times(2)).createTransaction(transactionCaptor.capture());

		// Verify single account transaction creation details
		assertEquals(2, transactionCaptor.getAllValues().size(), "Two initial transactions should have been created");
		SingleAccountTransaction checkingDeposit = transactionCaptor.getAllValues().stream()
				.filter(txn -> "deposit".equals(txn.getTransactionType())
						&& expectedCheckingBalance.compareTo(txn.getTransactionAmount()) == 0)
				.findFirst().orElse(null);
		SingleAccountTransaction savingDeposit = transactionCaptor.getAllValues().stream()
				.filter(txn -> "deposit".equals(txn.getTransactionType())
						&& expectedSavingBalance.compareTo(txn.getTransactionAmount()) == 0)
				.findFirst().orElse(null);

		assertNotNull(checkingDeposit, "Checking deposit transaction should have been created");
		assertNotNull(savingDeposit, "Savings deposit transaction should have been created");

		// Verify checking account initial deposit transaction creation details
		assertEquals("Initial Deposit", checkingDeposit.getDescription(), "Checking deposit description should match");
		assertEquals(LocalDate.now(), checkingDeposit.getTransactionDate(), "Checking deposit date should be today");
		assertEquals(checkingAccountCreated.getAccountNo(), checkingDeposit.getAccountNo(),
				"Checking deposit account number should match checking account");

		// Verify savings account initial deposit transaction creation details
		assertEquals("Initial Deposit", savingDeposit.getDescription(), "Savings deposit description should match");
		assertEquals(LocalDate.now(), savingDeposit.getTransactionDate(), "Savings deposit date should be today");
		assertEquals(savingsAccountCreated.getAccountNo(), savingDeposit.getAccountNo(),
				"Savings deposit account number should match savings account");

		// Verify no other interactions
		verifyNoMoreInteractions(userRepository, accountService, singleAccountTransactionService, passwordEncoder,
				passwordResetTokenRepository, passwordResetEmailService);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when authenticating non-existent user")
	void authenticateUser_userNotFound_throwsException() {
		/* Arrange */
		String emailToAuthenticate = "nonexistent@example.com";
		String passwordAttempt = "somepassword";

		// Mock finding the user to return empty
		when(userRepository.findByEmail(emailToAuthenticate)).thenReturn(Optional.empty());

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.authenticateUser(emailToAuthenticate, passwordAttempt);
		}, "Should throw IllegalArgumentException when user is not found");

		String expectedErrorMessage = "User not found";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify user repository call
		verify(userRepository, times(1)).findByEmail(emailToAuthenticate);

		// Verify no other interactions
		verifyNoInteractions(passwordEncoder);
		verifyNoMoreInteractions(userRepository);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when authenticating with incorrect password")
	void authenticateUser_incorrectPassword_throwsException() {
		/* Arrange */
		String emailToAuthenticate = sampleUser.getEmail();
		String incorrectPasswordAttempt = "wrongpassword";

		// Mock finding the user
		when(userRepository.findByEmail(emailToAuthenticate)).thenReturn(Optional.of(sampleUser));
		// Mock password match check to return false
		when(passwordEncoder.matches(incorrectPasswordAttempt, sampleUser.getPassword())).thenReturn(false);

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.authenticateUser(emailToAuthenticate, incorrectPasswordAttempt);
		}, "Should throw IllegalArgumentException when password is incorrect");

		String expectedErrorMessage = "Invalid username or password";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify repository and password encoder calls
		verify(userRepository, times(1)).findByEmail(emailToAuthenticate);
		verify(passwordEncoder, times(1)).matches(incorrectPasswordAttempt, sampleUser.getPassword());

		// Verify no other interactions
		verifyNoMoreInteractions(userRepository, passwordEncoder);
	}

	@Test
	@DisplayName("Should authenticate user with correct credentials")
	void authenticateUser_success() {
		/* Arrange */
		String emailToAuthenticate = sampleUser.getEmail();
		String passwordAttempt = sampleRawPassword;

		// Mock finding the user
		when(userRepository.findByEmail(emailToAuthenticate)).thenReturn(Optional.of(sampleUser));
		// Mock password match check
		when(passwordEncoder.matches(passwordAttempt, sampleUser.getPassword())).thenReturn(true);

		/* Act */
		User actualAuthenticatedUser = userService.authenticateUser(emailToAuthenticate, passwordAttempt);

		/* Assert */
		// Verify authenticated user details
		assertNotNull(actualAuthenticatedUser, "Authenticated user should not be null");
		assertEquals(sampleUser.getUserId(), actualAuthenticatedUser.getUserId(), "Authenticated user ID should match");
		assertEquals(sampleUser.getEmail(), actualAuthenticatedUser.getEmail(),
				"Authenticated user email should match");

		// Verify repository and password encoder calls
		verify(userRepository, times(1)).findByEmail(emailToAuthenticate);
		verify(passwordEncoder, times(1)).matches(passwordAttempt, actualAuthenticatedUser.getPassword());

		// Verify no other interactions
		verifyNoMoreInteractions(userRepository, passwordEncoder);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when sending password reset email for non-existent user")
	void sendPasswordResetEmail_userNotFound_throwsException() {
		/* Arrange */
		String emailForReset = "nonexistent@example.com";

		// Mock finding the user to return empty
		when(userRepository.findByEmail(emailForReset)).thenReturn(Optional.empty());

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.sendPasswordResetEmail(emailForReset);
		}, "Should throw IllegalArgumentException when user is not found for email");

		String expectedErrorMessage = "User not found";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify repository call
		verify(userRepository, times(1)).findByEmail(emailForReset);

		// Verify no other interactions
		verifyNoInteractions(passwordResetTokenRepository, passwordResetEmailService);
		verifyNoMoreInteractions(userRepository);
	}

	@Test
	@DisplayName("Should send password reset email and save token for existing user")
	void sendPasswordResetEmail_userFound_sendsEmailAndSavesToken() {
		/* Arrange */
		String emailForReset = sampleUser.getEmail();

		// Mock finding the user
		when(userRepository.findByEmail(emailForReset)).thenReturn(Optional.of(sampleUser));

		// Mock saving the password reset token
		when(passwordResetTokenRepository.save(any(PasswordResetToken.class)))
				.thenAnswer(invocation -> invocation.getArgument(0));

		// Mock sending the email (do nothing)
		doNothing().when(passwordResetEmailService).sendEmail(anyString(), anyString());

		// Capture arguments for token and email service calls
		ArgumentCaptor<PasswordResetToken> tokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
		ArgumentCaptor<String> emailCaptor = ArgumentCaptor.forClass(String.class);
		ArgumentCaptor<String> tokenStringCaptor = ArgumentCaptor.forClass(String.class);

		// Capture time before the call for expiration check
		long startTime = System.currentTimeMillis();

		/* Act */
		assertDoesNotThrow(() -> userService.sendPasswordResetEmail(emailForReset),
				"Should not throw exception for existing user");

		/* Assert */
		// Verify user was found
		verify(userRepository, times(1)).findByEmail(emailForReset);

		// Verify token was saved
		verify(passwordResetTokenRepository, times(1)).save(tokenCaptor.capture());
		PasswordResetToken actualTokenSaved = tokenCaptor.getValue();

		assertNotNull(actualTokenSaved.getToken(), "Token string should be generated");
		assertNotNull(actualTokenSaved.getExpiration(), "Token expiration date should be set");
		assertEquals(sampleUser.getUserId(), actualTokenSaved.getUserId(), "Token should be linked to the user ID");

		// Check expiration is ~1 hour from the time of the call (allow a small margin)
		long expectedExpirationTimeStart = startTime + 3600000; // 1 hour in milliseconds
		long expectedExpirationTimeEnd = startTime + 3600000 + 5000; // Allow 5s margin for execution time

		assertTrue(actualTokenSaved.getExpiration().getTime() >= expectedExpirationTimeStart,
				"Token expiration should be at least 1 hour from start time");
		assertTrue(actualTokenSaved.getExpiration().getTime() <= expectedExpirationTimeEnd,
				"Token expiration should be approximately 1 hour from start time");

		// Verify email was sent
		verify(passwordResetEmailService, times(1)).sendEmail(emailCaptor.capture(), tokenStringCaptor.capture());

		// Verify email service received correct arguments
		assertEquals(sampleUser.getEmail(), emailCaptor.getValue(), "Email service should receive user's email");
		assertEquals(actualTokenSaved.getToken(), tokenStringCaptor.getValue(),
				"Email service should receive the generated token string");

		// Verify no other interactions
		verifyNoMoreInteractions(userRepository, passwordResetTokenRepository, passwordResetEmailService);
		verifyNoInteractions(accountService, singleAccountTransactionService, passwordEncoder);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException for invalid password reset token")
	void resetPassword_invalidToken_throwsException() {
		/* Arrange */
		String resetTokenString = "invalid-token";
		String newRawPassword = "newPassword456";

		// Mock finding the token to return empty
		when(passwordResetTokenRepository.findByToken(resetTokenString)).thenReturn(Optional.empty());

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.resetPassword(resetTokenString, newRawPassword);
		}, "Should throw IllegalArgumentException for invalid token");

		String expectedErrorMessage = "Invalid token";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify token repository call
		verify(passwordResetTokenRepository, times(1)).findByToken(resetTokenString);

		// Verify no other interactions
		verifyNoInteractions(userRepository, passwordEncoder);
		verifyNoMoreInteractions(passwordResetTokenRepository);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException for expired password reset token")
	void resetPassword_expiredToken_throwsException() {
		/* Arrange */
		String resetTokenString = "expired-token";
		String newRawPassword = "newPassword456";

		// Create a password reset token with a past expiration
		PasswordResetToken expiredToken = new PasswordResetToken(resetTokenString,
				new Date(System.currentTimeMillis() - 1000), sampleUserId);

		// Mock finding the token
		when(passwordResetTokenRepository.findByToken(resetTokenString)).thenReturn(Optional.of(expiredToken));

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.resetPassword(resetTokenString, newRawPassword);
		}, "Should throw IllegalArgumentException for expired token");

		String expectedErrorMessage = "Token expired";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify token repository call
		verify(passwordResetTokenRepository, times(1)).findByToken(resetTokenString);

		// Verify no other interactions
		verifyNoInteractions(userRepository, passwordEncoder);
		verifyNoMoreInteractions(passwordResetTokenRepository);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException if user is not found for valid token")
	void resetPassword_userNotFoundForToken_throwsException() {
		/* Arrange */
		String resetTokenString = "token-for-nonexistent-user";
		String newRawPassword = "newPassword456";
		UUID userIdForNonexistentUser = UUID.randomUUID();

		// Create a password reset token linked to a non-existent user
		PasswordResetToken tokenForNonexistentUser = new PasswordResetToken(resetTokenString,
				new Date(System.currentTimeMillis() + 100000), userIdForNonexistentUser);

		// Mock finding the token
		when(passwordResetTokenRepository.findByToken(resetTokenString))
				.thenReturn(Optional.of(tokenForNonexistentUser));

		// Mock finding the user by the token's userId to return empty
		when(userRepository.findById(userIdForNonexistentUser)).thenReturn(Optional.empty());

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.resetPassword(resetTokenString, newRawPassword);
		}, "Should throw IllegalArgumentException if user for token is not found");

		String expectedErrorMessage = "User not found for token";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify token and user repository calls
		verify(passwordResetTokenRepository, times(1)).findByToken(resetTokenString);
		verify(userRepository, times(1)).findById(userIdForNonexistentUser);

		// Verify no other interactions
		verifyNoInteractions(passwordEncoder);
		verifyNoMoreInteractions(passwordResetTokenRepository, userRepository);
	}

	@Test
	@DisplayName("Should reset password with a valid token")
	void resetPassword_validToken_success() {
		/* Arrange */
		String resetTokenString = "valid-reset-token";
		String newRawPassword = "newPassword456";
		String newHashedPassword = "hashedNewPassword456";

		// Create a password reset token with a future expiration
		PasswordResetToken validToken = new PasswordResetToken(resetTokenString,
				new Date(System.currentTimeMillis() + 100000), sampleUserId);

		// Mock finding the token
		when(passwordResetTokenRepository.findByToken(resetTokenString)).thenReturn(Optional.of(validToken));

		// Mock finding the user by the token's userId
		when(userRepository.findById(sampleUserId)).thenReturn(Optional.of(sampleUser));

		// Mock encoding the new password
		when(passwordEncoder.encode(newRawPassword)).thenReturn(newHashedPassword);

		// Mock saving the user
		when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

		// Mock deleting all tokens associated with the user (do nothing)
		doNothing().when(passwordResetTokenRepository).deleteAllByUserId(any(UUID.class));

		// Capture argument for saved user
		ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

		/* Act */
		assertDoesNotThrow(() -> userService.resetPassword(resetTokenString, newRawPassword),
				"Should reset password without exception for valid token");

		/* Assert */
		// Verify token was found
		verify(passwordResetTokenRepository, times(1)).findByToken(resetTokenString);

		// Verify user was found by token's userId
		verify(userRepository, times(1)).findById(sampleUserId);

		// Verify new password was encoded
		verify(passwordEncoder, times(1)).encode(newRawPassword);

		// Verify user was saved with the new password
		verify(userRepository, times(1)).save(userCaptor.capture());
		User actualUserSaved = userCaptor.getValue();
		assertNotNull(actualUserSaved, "User should have been saved");
		assertEquals(newHashedPassword, actualUserSaved.getPassword(),
				"User's password should be updated to the new hashed password");

		// Verify old tokens for the user were deleted
		verify(passwordResetTokenRepository, times(1)).deleteAllByUserId(sampleUserId);

		// Verify no other interactions
		verifyNoMoreInteractions(passwordResetTokenRepository, userRepository, passwordEncoder);
		verifyNoInteractions(accountService, singleAccountTransactionService, passwordResetEmailService);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when updating contact info for non-existent user")
	void updateContactInfo_userNotFound_throwsException() {
		/* Arrange */
		UUID userIdToUpdate = UUID.randomUUID();
		String newEmail = "john.doe.new@example.com";
		String newPhone = "9876543210";
		String newAddress = "456 Pine Ln";

		// Mock finding the user to return empty
		when(userRepository.findById(userIdToUpdate)).thenReturn(Optional.empty());

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.updateContactInfo(userIdToUpdate, newEmail, newPhone, newAddress);
		}, "Should throw IllegalArgumentException when user not found for update");

		String expectedErrorMessage = "User not found";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify user repository call
		verify(userRepository, times(1)).findById(userIdToUpdate);

		// Verify no other interactions
		verifyNoMoreInteractions(userRepository);
		verifyNoInteractions(accountService, singleAccountTransactionService, passwordEncoder,
				passwordResetTokenRepository, passwordResetEmailService);
	}

	@Test
	@DisplayName("Should save user even if contact information is the same")
	void updateContactInfo_noChangesProvided_savesUser() {
		/* Arrange */
		UUID userIdToUpdate = sampleUserId;
		String sameEmail = sampleUser.getEmail();
		String samePhone = sampleUser.getPhone();
		String sameAddress = sampleUser.getAddress();

		// Mock finding the user
		when(userRepository.findById(userIdToUpdate)).thenReturn(Optional.of(sampleUser));

		// Mock saving the user
		when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

		// Capture argument for saved user
		ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

		/* Act */
		assertDoesNotThrow(() -> userService.updateContactInfo(userIdToUpdate, sameEmail, samePhone, sameAddress),
				"Should attempt to save even if no changes");

		/* Assert */
		// Verify user was found
		verify(userRepository, times(1)).findById(userIdToUpdate);

		// Verify user was saved
		verify(userRepository, times(1)).save(userCaptor.capture());
		User actualUserSaved = userCaptor.getValue();

		// Verify the saved user's details match the original details
		assertNotNull(actualUserSaved, "User should have been saved");
		assertEquals(sampleUser.getUserId(), actualUserSaved.getUserId(), "Saved user ID should match original");
		assertEquals(sameEmail, actualUserSaved.getEmail(), "Saved user email should be the same");
		assertEquals(samePhone, actualUserSaved.getPhone(), "Saved user phone should be the same");
		assertEquals(sameAddress, actualUserSaved.getAddress(), "Saved user address should be the same");

		// Verify no other interactions
		verifyNoMoreInteractions(userRepository);
		verifyNoInteractions(accountService, singleAccountTransactionService, passwordEncoder,
				passwordResetTokenRepository, passwordResetEmailService);
	}

	@Test
	@DisplayName("Should update user contact information if changed")
	void updateContactInfo_changesProvided_updatesUser() {
		/* Arrange */
		UUID userIdToUpdate = sampleUserId;
		String newEmail = "john.doe.new@example.com";
		String newPhone = "9876543210";
		String newAddress = "456 Pine Ln";

		// Mock finding the user
		when(userRepository.findById(userIdToUpdate)).thenReturn(Optional.of(sampleUser));

		// Mock saving the user
		when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

		// Capture argument for saved user
		ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

		/* Act */
		assertDoesNotThrow(() -> userService.updateContactInfo(userIdToUpdate, newEmail, newPhone, newAddress),
				"Should update contact info without exception");

		/* Assert */
		// Verify user was found
		verify(userRepository, times(1)).findById(userIdToUpdate);

		// Verify user was saved
		verify(userRepository, times(1)).save(userCaptor.capture());
		User actualUserSaved = userCaptor.getValue();
		assertNotNull(actualUserSaved, "User should have been saved");

		// Verify updated user details
		assertEquals(newEmail, actualUserSaved.getEmail(), "User email should be updated");
		assertEquals(newPhone, actualUserSaved.getPhone(), "User phone should be updated");
		assertEquals(newAddress, actualUserSaved.getAddress(), "User address should be updated");
		assertEquals(sampleUser.getFirstName(), actualUserSaved.getFirstName(), "Other fields should not change");

		// Verify no other interactions
		verifyNoMoreInteractions(userRepository);
		verifyNoInteractions(accountService, singleAccountTransactionService, passwordEncoder,
				passwordResetTokenRepository, passwordResetEmailService);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when current password is null")
	void updatePassword_currentPasswordIsNull_throwsException() {
		/* Arrange */
		UUID userIdToUpdate = sampleUserId;
		String currentRawPassword = null;
		String newRawPassword = "aDifferentNewPassword789";

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.updatePassword(userIdToUpdate, currentRawPassword, newRawPassword);
		}, "Should throw IllegalArgumentException when current password is null");

		String expectedErrorMessage = "Password fields must not be null";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify no interactions
		verifyNoInteractions(userRepository, passwordEncoder, accountService, singleAccountTransactionService,
				passwordResetTokenRepository, passwordResetEmailService);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when new password is null")
	void updatePassword_newPasswordIsNull_throwsException() {
		/* Arrange */
		UUID userIdToUpdate = sampleUserId;
		String currentRawPassword = sampleRawPassword;
		String newRawPassword = null;

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.updatePassword(userIdToUpdate, currentRawPassword, newRawPassword);
		}, "Should throw IllegalArgumentException when new password is null");

		String expectedErrorMessage = "Password fields must not be null";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify no interactions
		verifyNoInteractions(userRepository, passwordEncoder, accountService, singleAccountTransactionService,
				passwordResetTokenRepository, passwordResetEmailService);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when updating password for non-existent user")
	void updatePassword_userNotFound_throwsException() {
		/* Arrange */
		UUID userIdToUpdate = UUID.randomUUID();
		String currentRawPassword = sampleRawPassword;
		String newRawPassword = "aDifferentNewPassword789";

		// Mock finding the user to return empty
		when(userRepository.findById(userIdToUpdate)).thenReturn(Optional.empty());

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.updatePassword(userIdToUpdate, currentRawPassword, newRawPassword);
		}, "Should throw IllegalArgumentException when user not found for password update");

		String expectedErrorMessage = "User not found";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify user repository call
		verify(userRepository, times(1)).findById(userIdToUpdate);

		// Verify no other interactions
		verifyNoMoreInteractions(userRepository);
		verifyNoInteractions(passwordEncoder, accountService, singleAccountTransactionService,
				passwordResetTokenRepository, passwordResetEmailService);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when updating password with incorrect current password")
	void updatePassword_incorrectCurrentPassword_throwsException() {
		/* Arrange */
		UUID userIdToUpdate = sampleUserId;
		String incorrectCurrentRawPassword = "wrongCurrentPassword";
		String newRawPassword = "aDifferentNewPassword789";

		// Mock finding the user
		when(userRepository.findById(userIdToUpdate)).thenReturn(Optional.of(sampleUser));

		// Mock password checks (current password does not match)
		when(passwordEncoder.matches(incorrectCurrentRawPassword, sampleUser.getPassword())).thenReturn(false);

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.updatePassword(userIdToUpdate, incorrectCurrentRawPassword, newRawPassword);
		}, "Should throw IllegalArgumentException when current password is incorrect");

		String expectedErrorMessage = "Invalid current password";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify user repository and password encoder calls
		verify(userRepository, times(1)).findById(userIdToUpdate);
		verify(passwordEncoder, times(1)).matches(incorrectCurrentRawPassword, sampleUser.getPassword());

		// Verify no other interactions
		verifyNoMoreInteractions(userRepository, passwordEncoder);
		verifyNoInteractions(accountService, singleAccountTransactionService, passwordResetTokenRepository,
				passwordResetEmailService);
	}

	@Test
	@DisplayName("Should throw IllegalArgumentException when new password is same as current password")
	void updatePassword_newPasswordSameAsCurrent_throwsException() {
		/* Arrange */
		UUID userIdToUpdate = sampleUserId;
		String currentRawPassword = sampleRawPassword;
		String newRawPasswordSameAsCurrent = sampleRawPassword;

		// Mock finding the user
		when(userRepository.findById(userIdToUpdate)).thenReturn(Optional.of(sampleUser));

		// Mock password checks
		when(passwordEncoder.matches(currentRawPassword, sampleUser.getPassword())).thenReturn(true);
		when(passwordEncoder.matches(newRawPasswordSameAsCurrent, sampleUser.getPassword())).thenReturn(true);

		/* Act & Assert */
		IllegalArgumentException actualException = assertThrows(IllegalArgumentException.class, () -> {
			userService.updatePassword(userIdToUpdate, currentRawPassword, newRawPasswordSameAsCurrent);
		}, "Should throw IllegalArgumentException when new password is same as current");

		String expectedErrorMessage = "New password must be different from current password";
		assertEquals(expectedErrorMessage, actualException.getMessage(), "Exception message should match");

		// Verify user repository and password encoder calls
		verify(userRepository, times(1)).findById(userIdToUpdate);
		verify(passwordEncoder, times(2)).matches(currentRawPassword, sampleUser.getPassword());

		// Verify no other interactions
		verifyNoInteractions(accountService, singleAccountTransactionService, passwordResetTokenRepository,
				passwordResetEmailService);
	}

	@Test
	@DisplayName("Should update password with correct current password")
	void updatePassword_correctCurrentPassword_success() {
		/* Arrange */
		UUID userIdToUpdate = sampleUserId;
		String originalPassword = sampleUser.getPassword();
		String currentRawPassword = sampleRawPassword;
		String newRawPassword = "aDifferentNewPassword789";
		String newHashedPassword = "hashedDifferentNewPassword789";

		// Mock finding the user
		when(userRepository.findById(userIdToUpdate)).thenReturn(Optional.of(sampleUser));

		// Mock password checks
		when(passwordEncoder.matches(currentRawPassword, originalPassword)).thenReturn(true);
		when(passwordEncoder.matches(newRawPassword, originalPassword)).thenReturn(false);

		// Mock encoding the new password
		when(passwordEncoder.encode(newRawPassword)).thenReturn(newHashedPassword);

		// Mock saving the user
		when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

		// Capture the saved user
		ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

		/* Act */
		assertDoesNotThrow(() -> userService.updatePassword(userIdToUpdate, currentRawPassword, newRawPassword),
				"Should update password without exception");

		/* Assert */
		// Verify user repository and password encoder calls
		verify(userRepository, times(1)).findById(userIdToUpdate);
		verify(passwordEncoder, times(1)).matches(currentRawPassword, originalPassword);
		verify(passwordEncoder, times(1)).matches(newRawPassword, originalPassword);
		verify(passwordEncoder, times(1)).encode(newRawPassword);
		verify(userRepository, times(1)).save(userCaptor.capture());

		// Verify saved user's password is updated
		User actualUserSaved = userCaptor.getValue();
		assertNotNull(actualUserSaved, "User should have been saved");
		assertEquals(newHashedPassword, actualUserSaved.getPassword(),
				"User's password should be updated to the new hashed password");

		// Verify no other interactions
		verifyNoMoreInteractions(userRepository, passwordEncoder);
		verifyNoInteractions(accountService, singleAccountTransactionService, passwordResetTokenRepository,
				passwordResetEmailService);
	}
}
