package capstone.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import capstone.backend.entity.Account;
import capstone.backend.entity.AccountTransfer;
import capstone.backend.entity.TransferTransaction;
import capstone.backend.repository.AccountRepository;
import capstone.backend.repository.AccountTransferRepository;
import capstone.backend.repository.TransferTransactionRepository;
import jakarta.transaction.Transactional;

@Service
public class TransferTransactionService {
	private final AccountRepository accountRepository;
	private final TransferTransactionRepository transferTransactionRepository;
	private final AccountTransferRepository accountTransferRepository;

	public TransferTransactionService(AccountRepository accountRepository,
			TransferTransactionRepository transferTransactionRepository,
			AccountTransferRepository accountTransferRepository) {
		this.accountRepository = accountRepository;
		this.transferTransactionRepository = transferTransactionRepository;
		this.accountTransferRepository = accountTransferRepository;
	}

	@Transactional
	public void transferBetweenAccounts(UUID userId, String sender, String receiver, BigDecimal amount) {
		if (sender.equals(receiver)) {
			throw new IllegalArgumentException("Sending and receiving accounts must be different");
		}

		Optional<Account> optionalSenderAccount = accountRepository.findByUserIdAndAccountType(userId, sender);
		Optional<Account> optionalReceiverAccount = accountRepository.findByUserIdAndAccountType(userId, receiver);

		if (!optionalSenderAccount.isPresent() || !optionalReceiverAccount.isPresent()) {
			throw new IllegalArgumentException("One or both accounts not found");
		}

		Account senderAccount = optionalSenderAccount.get();
		Account receiverAccount = optionalReceiverAccount.get();

		if (senderAccount.getBalance().compareTo(amount) < 0) {
			throw new IllegalArgumentException("Insufficient funds in the sending account");
		}

		senderAccount.setBalance(senderAccount.getBalance().subtract(amount));
		receiverAccount.setBalance(receiverAccount.getBalance().add(amount));

		accountRepository.save(senderAccount);
		accountRepository.save(receiverAccount);

		// Record transfer transaction
		createTransferTransaction(senderAccount, receiverAccount, amount);
	}

	@Transactional
	public void createTransferTransaction(Account senderAccount, Account receiverAccount, BigDecimal amount) {
		LocalDate currentDate = LocalDate.now();
		String senderAccountNo = senderAccount.getAccountNo();
		String receiverAccountNo = receiverAccount.getAccountNo();
		String description = "Transferred $" + amount + " from account " + senderAccountNo + " to account "
				+ receiverAccountNo;

		// Create transfer transaction
		TransferTransaction transferTransaction = new TransferTransaction(currentDate, amount, description);
		transferTransactionRepository.save(transferTransaction);

		UUID transferTransactionId = transferTransaction.getTransactionId();

		// Create account transfers
		AccountTransfer senderAccountTransfer = new AccountTransfer(senderAccountNo, transferTransactionId, "sender");
		AccountTransfer receiverAccountTransfer = new AccountTransfer(receiverAccountNo, transferTransactionId,
				"receiver");
		
		accountTransferRepository.save(senderAccountTransfer);
		accountTransferRepository.save(receiverAccountTransfer);
	}
}
