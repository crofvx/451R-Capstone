package capstone.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "transfer_transactions")
public class TransferTransaction {
	@Id
	@GeneratedValue(generator = "uuid2")
	@UuidGenerator
	@Column(name = "transaction_id", columnDefinition = "uniqueidentifier")
	private UUID transactionId;

	@Column(name = "transaction_date", nullable = false)
	private LocalDate transactionDate;

	@Column(name = "transaction_amount", precision = 18, scale = 2, nullable = false)
	private BigDecimal transactionAmount;

	@Column(name = "description", length = 250, nullable = false)
	private String description;

	// Constructors
	public TransferTransaction() {
	}

	public TransferTransaction(UUID transactionId, LocalDate transactionDate, BigDecimal transactionAmount,
			String description) {
		this.transactionId = transactionId;
		this.transactionDate = transactionDate;
		this.transactionAmount = transactionAmount;
		this.description = description;
	}

	public TransferTransaction(LocalDate transactionDate, BigDecimal transactionAmount, String description) {
		this.transactionDate = transactionDate;
		this.transactionAmount = transactionAmount;
		this.description = description;
	}

	// Getters and Setters
	public UUID getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(UUID transactionId) {
		this.transactionId = transactionId;
	}

	public LocalDate getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(LocalDate transactionDate) {
		this.transactionDate = transactionDate;
	}

	public BigDecimal getTransactionAmount() {
		return transactionAmount;
	}

	public void setTransactionAmount(BigDecimal transactionAmount) {
		this.transactionAmount = transactionAmount;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
