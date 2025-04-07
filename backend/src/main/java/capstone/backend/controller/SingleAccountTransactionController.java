package capstone.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import capstone.backend.entity.SingleAccountTransaction;
import capstone.backend.service.SingleAccountTransactionService;

@RestController
@RequestMapping("/api/transactions")
public class SingleAccountTransactionController {
	private final SingleAccountTransactionService transactionService;

	public SingleAccountTransactionController(SingleAccountTransactionService transactionService) {
		this.transactionService = transactionService;
	}

	@PostMapping
	public ResponseEntity<SingleAccountTransaction> createTransaction(
			@RequestBody SingleAccountTransaction transaction) {
		SingleAccountTransaction createdTransaction = transactionService.createTransaction(transaction);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
	}
}
