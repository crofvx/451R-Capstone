package capstone.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		// use more secure settings in a real-world app
		http.csrf(csrf -> csrf.disable()).authorizeHttpRequests(authz -> authz.anyRequest().permitAll());
		return http.build();
	}
}
