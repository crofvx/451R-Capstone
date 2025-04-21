package capstone.backend.entity;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Embeddable;

@Embeddable
public class AccountTransferId implements Serializable {
	private static final long serialVersionUID = 3258954706291005367L;

	private String accountNo;
	private UUID transactionId;

	// Constructors
	public AccountTransferId() {
	}

	public AccountTransferId(String accountNo, UUID transactionId) {
		this.accountNo = accountNo;
		this.transactionId = transactionId;
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

	// equals() and hashCode()
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}

		if (obj == null) {
			return false;
		}

		if (getClass() != obj.getClass()) {
			return false;
		}

		AccountTransferId other = (AccountTransferId) obj;
		return Objects.equals(accountNo, other.accountNo) && Objects.equals(transactionId, other.transactionId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(accountNo, transactionId);
	}
}
