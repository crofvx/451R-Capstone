package capstone.backend.utils;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
	// avoid hard-coding secret keys in a real-world app
	private final String jwtSecretKey = "GHTNU39st0VSeFMoeRAdgsuW8ok6v4GU+Lycy7fgVdtpPz2xhx8YlU+D/A07Zy4ByPnxzzeOWM4YSm0/fPioUg==";

	private SecretKey getSigningKey() {
		byte[] keyBytes = jwtSecretKey.getBytes(StandardCharsets.UTF_8);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String generateJwtToken(String userId, String email) {
		return Jwts.builder().subject(email).claim("userId", userId).signWith(getSigningKey(), Jwts.SIG.HS512)
				.compact();
	}
}
