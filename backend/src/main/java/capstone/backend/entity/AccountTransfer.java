package capstone.backend.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "account_transfers")
@IdClass(AccountTransferId.class)
public class AccountTransfer {
	@Id
	@Column(name = "account_no", length = 16)
	private String accountNo;

	@Id
	@Column(name = "transaction_id", columnDefinition = "uniqueidentifier")
	private UUID transactionId;

	@Column(name = "role", length = 10, nullable = false)
	private String role;

	// Constructors
	public AccountTransfer() {
	}

	public AccountTransfer(String accountNo, UUID transactionId, String role) {
		this.accountNo = accountNo;
		this.transactionId = transactionId;
		this.role = role;
	}

	// Getters and Setters
	public String getAccountNo() {
		return accountNo;
	}

	public void setAccountNo(String accountNo) {
		this.accountNo = accountNo;
	}

	public UUID getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(UUID transactionId) {
		this.transactionId = transactionId;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
}
