package capstone.backend.entity;

import java.util.Date;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {
	@Id
	@GeneratedValue(generator = "uuid2")
	@UuidGenerator
	@Column(name = "token_id", columnDefinition = "uniqueidentifier")
	private UUID tokenId;

	@Column(name = "token", nullable = false, unique = true)
	private String token;

	@Column(name = "expiration", nullable = false)
	private Date expiration;

	@Column(name = "user_id", nullable = false, columnDefinition = "uniqueidentifier")
	private UUID userId;

	// Constructors
	public PasswordResetToken() {
	}

	public PasswordResetToken(UUID tokenId, String token, Date expiration, UUID userId) {
		this.tokenId = tokenId;
		this.token = token;
		this.expiration = expiration;
		this.userId = userId;
	}

	public PasswordResetToken(String token, Date expiration, UUID userId) {
		this.token = token;
		this.expiration = expiration;
		this.userId = userId;
	}

	// Getters and Setters
	public UUID getTokenId() {
		return tokenId;
	}

	public void setTokenId(UUID tokenId) {
		this.tokenId = tokenId;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Date getExpiration() {
		return expiration;
	}

	public void setExpiration(Date expiration) {
		this.expiration = expiration;
	}

	public UUID getUserId() {
		return userId;
	}

	public void setUserId(UUID userId) {
		this.userId = userId;
	}
}
