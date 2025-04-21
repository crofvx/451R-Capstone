package capstone.backend.controller;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import capstone.backend.service.TransferTransactionService;
import capstone.backend.utils.JwtUtils;

@RestController
@RequestMapping("/api/transfers")
public class TransferTransactionController {
	private final TransferTransactionService transferTransactionService;
	private final JwtUtils jwtUtils;

	public TransferTransactionController(TransferTransactionService transferTransactionService, JwtUtils jwtUtils) {
		this.transferTransactionService = transferTransactionService;
		this.jwtUtils = jwtUtils;
	}

	@PostMapping
	public ResponseEntity<Object> transfer(@RequestHeader(name = "Authorization", required = false) String authHeader,
			@RequestBody Map<String, String> transferData) {
		try {
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				String token = authHeader.substring(7);
				UUID userId = UUID.fromString(jwtUtils.extractUserId(token));

				if (userId != null) {
					String sender = transferData.get("sender");
					String receiver = transferData.get("receiver");
					BigDecimal amount = new BigDecimal(transferData.get("amount"));

					transferTransactionService.transferBetweenAccounts(userId, sender, receiver, amount);
					return ResponseEntity.ok(Map.of("message", "Transferred funds"));
				} else {
					return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
				}
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Transfer failed due to an internal error"));
		}
	}
}
