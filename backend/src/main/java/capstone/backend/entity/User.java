package capstone.backend.entity;

import java.time.LocalDate;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
	@Id
	@GeneratedValue(generator = "uuid2")
	@UuidGenerator
	@Column(name = "user_id", columnDefinition = "uniqueidentifier")
	private UUID userId;

	@Column(name = "first_name", nullable = false, length = 50)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 50)
	private String lastName;

	@Column(name = "email", nullable = false, unique = true, length = 254)
	private String email;

	@Column(name = "phone", nullable = false, length = 10)
	private String phone;

	@Column(name = "address", nullable = false, length = 150)
	private String address;

	@Column(name = "birth_date", nullable = false)
	private LocalDate birthDate;

	@Column(name = "password", nullable = false, length = 128)
	private String password;

	// Constructors
	public User() {
	}

	public User(UUID userId, String firstName, String lastName, String email, String phone, String address,
			LocalDate birthDate, String password) {
		this.userId = userId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phone = phone;
		this.address = address;
		this.birthDate = birthDate;
		this.password = password;
	}

	public User(String firstName, String lastName, String email, String phone, String address, LocalDate birthDate,
			String password) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phone = phone;
		this.address = address;
		this.birthDate = birthDate;
		this.password = password;
	}

	// Getters and Setters
	public UUID getUserId() {
		return userId;
	}

	public void setUserId(UUID userId) {
		this.userId = userId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public LocalDate getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(LocalDate birthDate) {
		this.birthDate = birthDate;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
