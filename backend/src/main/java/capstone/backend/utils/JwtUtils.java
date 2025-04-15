package capstone.backend.utils;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
	@Value("${app.jwt-secret-key}")
	private String jwtSecretKey;

	private SecretKey getSigningKey() {
		byte[] keyBytes = jwtSecretKey.getBytes(StandardCharsets.UTF_8);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String generateJwtToken(String userId, String email) {
		return Jwts.builder().subject(email).claim("userId", userId).signWith(getSigningKey(), Jwts.SIG.HS512)
				.compact();
	}
}
