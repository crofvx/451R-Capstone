package capstone.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "accounts")
public class Account {
	@Id
	@Column(name = "account_no", length = 16)
	private String accountNo;

	@Column(name = "account_type", length = 10, nullable = false)
	private String accountType;

	@Column(name = "creation_date", nullable = false)
	private LocalDate creationDate;

	@Column(name = "balance", precision = 18, scale = 2, nullable = false)
	private BigDecimal balance;

	@Column(name = "user_id", nullable = false, columnDefinition = "uniqueidentifier")
	private UUID userId;

	// Constructors
	public Account() {
	}

	public Account(String accountNo, String accountType, LocalDate creationDate, BigDecimal balance, UUID userId) {
		this.accountNo = accountNo;
		this.accountType = accountType;
		this.creationDate = creationDate;
		this.balance = balance;
		this.userId = userId;
	}

	// Getters and Setters
	public String getAccountNo() {
		return accountNo;
	}

	public void setAccountNo(String accountNo) {
		this.accountNo = accountNo;
	}

	public String getAccountType() {
		return accountType;
	}

	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

	public LocalDate getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(LocalDate creationDate) {
		this.creationDate = creationDate;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

	public UUID getUserId() {
		return userId;
	}

	public void setUserId(UUID userId) {
		this.userId = userId;
	}
}
