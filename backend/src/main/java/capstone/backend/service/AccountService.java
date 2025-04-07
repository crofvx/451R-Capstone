package capstone.backend.service;

import java.security.SecureRandom;
import java.util.Random;

import org.springframework.stereotype.Service;

import capstone.backend.entity.Account;
import capstone.backend.repository.AccountRepository;

@Service
public class AccountService {
	private final AccountRepository accountRepository;

	public AccountService(AccountRepository accountRepository) {
		this.accountRepository = accountRepository;
	}

	public Account createAccount(Account account) {
		String accountNo = generateAccountNo();
		account.setAccountNo(accountNo);
		return accountRepository.save(account);
	}

	public String generateAccountNo() {
		String accountNo;
		boolean isDuplicate;

		do {
			accountNo = generateRandom16DigitNo();
			isDuplicate = accountRepository.existsById(accountNo);
		} while (isDuplicate);

		return accountNo;
	}

	private String generateRandom16DigitNo() {
		SecureRandom random = new SecureRandom();

		long min = 1000000000000000L;
		long max = 9999999999999999L;
		long range = max - min + 1;

		long randomNumber = (long) (random.nextDouble() * range) + min;
		return String.valueOf(randomNumber);
	}

	public long generateRandomBalance(long min, long max) {
		if (min >= max) {
			throw new IllegalArgumentException("min must be less than max");
		}

		Random random = new Random();
		long range = max - min + 1;
		long randomBalance = (long) (random.nextDouble() * range) + min;
		return randomBalance;
	}
}
