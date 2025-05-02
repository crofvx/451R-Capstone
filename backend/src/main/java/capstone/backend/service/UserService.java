package capstone.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import capstone.backend.entity.Account;
import capstone.backend.entity.PasswordResetToken;
import capstone.backend.entity.SingleAccountTransaction;
import capstone.backend.entity.User;
import capstone.backend.repository.PasswordResetTokenRepository;
import capstone.backend.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final AccountService accountService;
	private final SingleAccountTransactionService singleAccountTransactionService;
	private final PasswordEncoder passwordEncoder;
	private final PasswordResetTokenRepository passwordResetTokenRepository;
	private final PasswordResetEmailService passwordResetEmailService;

	public UserService(UserRepository userRepository, AccountService accountService,
			SingleAccountTransactionService singleAccountTransactionService, PasswordEncoder passwordEncoder,
			PasswordResetTokenRepository passwordResetTokenRepository,
			PasswordResetEmailService passwordResetEmailService) {
		this.userRepository = userRepository;
		this.accountService = accountService;
		this.singleAccountTransactionService = singleAccountTransactionService;
		this.passwordEncoder = passwordEncoder;
		this.passwordResetTokenRepository = passwordResetTokenRepository;
		this.passwordResetEmailService = passwordResetEmailService;
	}

	public boolean emailIsTaken(String email) {
		return userRepository.existsByEmail(email);
	}

	@Transactional
	public User createUser(User user) {
		// Create user account
		String hashedPassword = passwordEncoder.encode(user.getPassword());
		user.setPassword(hashedPassword);
		User newUser = userRepository.save(user);

		UUID userId = newUser.getUserId();
		LocalDate currentDate = LocalDate.now();
		BigDecimal checkingAccountBalance = new BigDecimal(accountService.generateRandomBalance(500, 1500));
		BigDecimal savingAccountBalance = new BigDecimal(accountService.generateRandomBalance(1000, 5000));

		// Create checking account
		Account checkingAccount = new Account("checking", currentDate, checkingAccountBalance, userId);
		accountService.createAccount(checkingAccount);

		// Create initial deposit transaction to checking account
		SingleAccountTransaction checkingAccountDeposit = new SingleAccountTransaction("deposit", currentDate,
				checkingAccountBalance, "Initial Deposit", checkingAccount.getAccountNo());
		singleAccountTransactionService.createTransaction(checkingAccountDeposit);

		// Create savings account
		Account savingsAccount = new Account("saving", currentDate, savingAccountBalance, userId);
		accountService.createAccount(savingsAccount);

		// Create initial deposit transaction to savings account
		SingleAccountTransaction savingAccountDeposit = new SingleAccountTransaction("deposit", currentDate,
				savingAccountBalance, "Initial Deposit", savingsAccount.getAccountNo());
		singleAccountTransactionService.createTransaction(savingAccountDeposit);

		return newUser;
	}

	public User authenticateUser(String email, String password) {
		Optional<User> optionalUser = userRepository.findByEmail(email);
		User user = optionalUser.orElseThrow(() -> new IllegalArgumentException("User not found"));

		if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new IllegalArgumentException("Invalid username or password");
		}

		return user;
	}

	@Transactional
	public void sendPasswordResetEmail(String email) {
		Optional<User> optionalUser = userRepository.findByEmail(email);
		User user = optionalUser.orElseThrow(() -> new IllegalArgumentException("User not found"));

		String token = UUID.randomUUID().toString();
		Date expiration = new Date(System.currentTimeMillis() + 3600000); // 1 hour expiration

		PasswordResetToken resetToken = new PasswordResetToken(token, expiration, user.getUserId());
		passwordResetTokenRepository.save(resetToken);

		passwordResetEmailService.sendEmail(user.getEmail(), token);
	}

	@Transactional
	public void resetPassword(String token, String newPassword) {
		PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
				.orElseThrow(() -> new IllegalArgumentException("Invalid token"));

		if (resetToken.getExpiration().before(new Date())) {
			throw new IllegalArgumentException("Token expired");
		}

		User user = userRepository.findById(resetToken.getUserId())
				.orElseThrow(() -> new IllegalArgumentException("User not found for token"));

		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
		passwordResetTokenRepository.deleteAllByUserId(user.getUserId());
	}

	@Transactional
	public void updateContactInfo(UUID userId, String newEmail, String newPhone, String newAddress) {
		Optional<User> optionalUser = userRepository.findById(userId);
		User user = optionalUser.orElseThrow(() -> new IllegalArgumentException("User not found"));

		if (!user.getEmail().equals(newEmail)) {
			if (emailIsTaken(newEmail)) {
				throw new IllegalArgumentException("Email is already taken");
			}

			user.setEmail(newEmail);
		}

		if (!user.getPhone().equals(newPhone)) {
			user.setPhone(newPhone);
		}

		if (!user.getAddress().equals(newAddress)) {
			user.setAddress(newAddress);
		}

		userRepository.save(user);
	}

	@Transactional
	public void updatePassword(UUID userId, String currentPassword, String newPassword) {
		if (currentPassword == null || newPassword == null) {
			throw new IllegalArgumentException("Password fields must not be null");
		}

		Optional<User> optionalUser = userRepository.findById(userId);
		User user = optionalUser.orElseThrow(() -> new IllegalArgumentException("User not found"));

		if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
			throw new IllegalArgumentException("Invalid current password");
		}

		if (passwordEncoder.matches(newPassword, user.getPassword())) {
			throw new IllegalArgumentException("New password must be different from current password");
		}

		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
	}
}
