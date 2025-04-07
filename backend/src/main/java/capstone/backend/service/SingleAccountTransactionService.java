package capstone.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import capstone.backend.entity.SingleAccountTransaction;
import capstone.backend.repository.SingleAccountTransactionRepository;

@Service
public class SingleAccountTransactionService {
	private final SingleAccountTransactionRepository singleAccountTransactionRepository;

	public SingleAccountTransactionService(SingleAccountTransactionRepository singleAccountTransactionRepository) {
		this.singleAccountTransactionRepository = singleAccountTransactionRepository;
	}

	@Transactional
	public SingleAccountTransaction createTransaction(SingleAccountTransaction transaction) {
		return singleAccountTransactionRepository.save(transaction);
	}
}
