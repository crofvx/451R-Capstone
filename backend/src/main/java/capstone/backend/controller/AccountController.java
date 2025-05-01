package capstone.backend.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import capstone.backend.entity.Account;
import capstone.backend.service.AccountService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/accounts")
public class AccountController {
	private final AccountService accountService;

	public AccountController(AccountService accountService) {
		this.accountService = accountService;
	}

	@PostMapping
	public Account createAccount(@RequestBody Account account) {
		return accountService.createAccount(account);
	}
	
	// account balance
	@GetMapping("/balances")
	public ResponseEntity<Map<String, BigDecimal>> getBalances(@RequestParam UUID userId) {
	    Optional<Account> checking = accountService.getAccountByUserIdAndType(userId, "checking");
	    Optional<Account> savings = accountService.getAccountByUserIdAndType(userId, "saving");

	    Map<String, BigDecimal> balances = new HashMap<>();
	    balances.put("checkingBalance", checking.map(Account::getBalance).orElse(BigDecimal.ZERO));
	    balances.put("savingsBalance", savings.map(Account::getBalance).orElse(BigDecimal.ZERO));

	    return ResponseEntity.ok(balances);
	}
}