package capstone.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import capstone.backend.entity.User;
import capstone.backend.service.UserService;
import capstone.backend.utils.JwtUtils;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
public class UserController {
	private final UserService userService;
	private final JwtUtils jwtUtils;

	public UserController(UserService userService, JwtUtils jwtUtils) {
		this.userService = userService;
		this.jwtUtils = jwtUtils;
	}
	

	@GetMapping("/check-email")
	public ResponseEntity<Map<String, Boolean>> checkEmailAvailability(@RequestParam String email) {
		boolean taken = userService.emailIsTaken(email);
		Map<String, Boolean> response = new HashMap<>();
		response.put("taken", taken);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/register")
	public ResponseEntity<User> createUser(@RequestBody User user) {
		User createdUser = userService.createUser(user);
		return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
	}

	@PostMapping("/login")
	public ResponseEntity<Object> login(@RequestBody Map<String, String> credentials) {
		String email = credentials.get("email");
		String password = credentials.get("password");

		User authenticatedUser = userService.authenticateUser(email, password);

		if (authenticatedUser != null) {
			String jwt = jwtUtils.generateJwtToken(authenticatedUser.getUserId().toString(), email);
			return ResponseEntity.ok(Map.of("message", "Login successful", "token", jwt));
		} else {
			return ResponseEntity.badRequest().body(Map.of("message", "Invalid email or password"));
		}
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<Object> requestPasswordReset(@RequestBody Map<String, String> emailData) {
		String email = emailData.get("email");

		if (StringUtils.hasText(email)) {
			userService.sendPasswordResetEmail(email);
			return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
		} else {
			return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
		}
	}

	@PostMapping("/reset-password")
	public ResponseEntity<Object> resetPassword(@RequestBody Map<String, String> newPasswordData) {
		String resetToken = newPasswordData.get("token");
		String newPassword = newPasswordData.get("newPassword");

		if (StringUtils.hasText(resetToken) && StringUtils.hasText(newPassword)) {
			userService.resetPassword(resetToken, newPassword);
			return ResponseEntity.ok(Map.of("message", "Password reset"));
		} else {
			return ResponseEntity.badRequest().body(Map.of("message", "Reset token and new password are required"));
		}
	}
	
	@PostMapping("/update-contact")
	public ResponseEntity<Object> updateContactInfo(@RequestHeader(name="Authorization", required=false) String authHeader,
			@RequestBody Map<String, String> newContactData) {
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			UUID userId = UUID.fromString(jwtUtils.extractUserId(token));
			
			if (userId != null) {
				String email = newContactData.get("email");
				String phone = newContactData.get("phone");
				String address = newContactData.get("address");
				
				userService.updateContactInfo(userId, email, phone, address);
				
				return ResponseEntity.ok(Map.of("message", "Contact Reset"));
		
			}
			else{
					return ResponseEntity.badRequest().body(Map.of("message", "User not found."));
			}
			
			
		}
		return ResponseEntity.badRequest().body(Map.of("message", "Error occurred."));
	}


	
	@PostMapping("/update-password")
	public ResponseEntity<Object> updatePassword(@RequestHeader(name="Authorization", required=false) String authHeader,
			@RequestBody Map<String, String> newPasswordData) {
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			UUID userId = UUID.fromString(jwtUtils.extractUserId(token));
			
			if (userId != null) {
				
				String currentPassword = newPasswordData.get("currentPassword");
				String newPassword = newPasswordData.get("newPassword");
				
				userService.updatePassword(userId, currentPassword, newPassword);
				
				
				
				return ResponseEntity.ok(Map.of("message", "Password Reset"));
		
			}
			else {
				return ResponseEntity.badRequest().body(Map.of("message", "Error occurred."));
			}
			
		}
		return ResponseEntity.badRequest().body(Map.of("message", "Failed"));
			
	}
}
	
