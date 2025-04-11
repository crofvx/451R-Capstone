package capstone.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import capstone.backend.entity.Account;
import capstone.backend.entity.SingleAccountTransaction;
import capstone.backend.entity.User;
import capstone.backend.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final AccountService accountService;
	private final SingleAccountTransactionService singleAccountTransactionService;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, AccountService accountService,
			SingleAccountTransactionService singleAccountTransactionService, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.accountService = accountService;
		this.singleAccountTransactionService = singleAccountTransactionService;
		this.passwordEncoder = passwordEncoder;
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
		Account checkingAccount = new Account();
		checkingAccount.setAccountType("checking");
		checkingAccount.setCreationDate(currentDate);
		checkingAccount.setBalance(checkingAccountBalance);
		checkingAccount.setUserId(userId);
		accountService.createAccount(checkingAccount);

		String checkingAccountNo = checkingAccount.getAccountNo();

		// Create initial deposit transaction to checking account
		SingleAccountTransaction checkingAccountDeposit = new SingleAccountTransaction();
		checkingAccountDeposit.setTransactionType("deposit");
		checkingAccountDeposit.setTransactionDate(currentDate);
		checkingAccountDeposit.setTransactionAmount(checkingAccountBalance);
		checkingAccountDeposit.setDescription("Initial Deposit");
		checkingAccountDeposit.setAccountNo(checkingAccountNo);
		singleAccountTransactionService.createTransaction(checkingAccountDeposit);

		// Create savings account
		Account savingsAccount = new Account();
		savingsAccount.setAccountType("saving");
		savingsAccount.setCreationDate(currentDate);
		savingsAccount.setBalance(savingAccountBalance);
		savingsAccount.setUserId(userId);
		accountService.createAccount(savingsAccount);

		String savingsAccountNo = savingsAccount.getAccountNo();

		// Create initial deposit transaction to savings account
		SingleAccountTransaction savingAccountDeposit = new SingleAccountTransaction();
		savingAccountDeposit.setTransactionType("deposit");
		savingAccountDeposit.setTransactionDate(currentDate);
		savingAccountDeposit.setTransactionAmount(savingAccountBalance);
		savingAccountDeposit.setDescription("Initial Deposit");
		savingAccountDeposit.setAccountNo(savingsAccountNo);
		singleAccountTransactionService.createTransaction(savingAccountDeposit);

		return newUser;
	}

	public User authenticateUser(String email, String password) {
		Optional<User> optionalUser = userRepository.findUserByEmail(email);

		if (optionalUser.isPresent()) {
			User user = optionalUser.get();
			if (passwordEncoder.matches(password, user.getPassword())) {
				return user;
			}
		}

		return null;
	}
}
