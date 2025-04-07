package capstone.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import capstone.backend.entity.User;
import capstone.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
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

		if (userService.authenticateUser(email, password)) {
			return ResponseEntity.ok(Map.of("message", "Login successful"));
		} else {
			return ResponseEntity.badRequest().body(Map.of("message", "Invalid email or password"));
		}
	}
}
