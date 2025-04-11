package capstone.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import capstone.backend.entity.User;
import capstone.backend.service.UserService;
import capstone.backend.utils.JwtUtils;

@RestController
@RequestMapping("/api/users")
public class UserController {
	private final UserService userService;
	private final JwtUtils jwtUtils;

	public UserController(UserService userService, JwtUtils jwtUtils) {
		this.userService = userService;
		this.jwtUtils = jwtUtils;
	}

	@GetMapping("/checkEmail")
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
}
