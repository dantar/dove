package it.dantar.cav.security.jwt;

import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import it.dantar.cav.entities.TokenBlacklist;
import it.dantar.cav.entities.TokenBlacklistDao;
import it.dantar.cav.security.AppUserDetails;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtTokenService implements Serializable {

	@Autowired
	private TokenBlacklistDao tokenBlacklistDao;

	private static final long serialVersionUID = -2550185165626007488L;

	private static final String JWT_MFA_INIT_FLOW_TOKEN = "MFA_init_flow";

	private static final String JWT_MFA_INIT_FLOW_TOKEN_TYPE = "temporary_MFA_init_flow_token";

	private static final String JWT_TOKEN_TYPE = "dantar_type";

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.token.validity}")
	private long jwtTokenValidity;

	public String generateAuthenticationTokenForUser(UserDetails userDetails) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("authorities", userDetails.getAuthorities());
		return doGenerateToken(claims, userDetails.getUsername());
	}

	public String generateMFAToken(AppUserDetails user, String secret, String otpauth) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("secret", secret);
		claims.put("otpauth", otpauth);
		claims.put("username", user.getUtente().getUsername());

		return Jwts.builder().setClaims(claims).setHeaderParam(JWT_TOKEN_TYPE, JWT_MFA_INIT_FLOW_TOKEN_TYPE).setSubject(JWT_MFA_INIT_FLOW_TOKEN)
				.setIssuedAt(new Date(System.currentTimeMillis())).setExpiration(new Date(System.currentTimeMillis() + jwtTokenValidity * 1000))
				.signWith(getSigningKey(), SignatureAlgorithm.HS512).compact();
	}

	private String doGenerateToken(Map<String, Object> claims, String subject) {
		return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + jwtTokenValidity * 1000)).signWith(getSigningKey(), SignatureAlgorithm.HS512).compact();
	}

	public Optional<Claims> parseJwtToken(String token) {
		if (tokenBlacklistDao.findById(token).isPresent()) {
			log.warn("JWT is blacklisted");
			return Optional.empty();
		}
		try {
			Optional<Claims> claims = Optional.of(Jwts
					.parserBuilder()
					.setSigningKey(getSigningKey())
					.build()
					.parseClaimsJws(token))
					.map(Jwt::getBody);
			if (claims.isPresent() && claims.get().getExpiration().before(new Date())) {
				log.warn("JWT is expired");
				return Optional.empty();
			}
			return claims;
		} catch (Exception e) {
			log.warn("JWT is invalid", e);
			return Optional.empty();
		}
	}
	
	public String getJwtToken(HttpServletRequest request) {
		// search cookies
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("auth_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
		// search authorizazion bearer header
		final String requestTokenHeader = request.getHeader("Authorization");
		if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
			return requestTokenHeader.substring("Bearer ".length());
		}
		log.debug("JWT Token not found");
		return null;
	}

	public void addToBlacklist(String t) {
		// this should be called on logout
		// so that user cannot be authenticated after having been logged out
		Optional<TokenBlacklist> f = tokenBlacklistDao.findById(t);
		log.info(String.format("Log out token %s", t));
		if (!f.isPresent()) {			
			TokenBlacklist token = new TokenBlacklist();
			token.setToken(t);
			token.setTimestamp(new Date());
			tokenBlacklistDao.save(token);
		}
	}
	
	//@Scheduled(fixedDelayString = "${app.jwt.blacklist.delay}")
	//@SchedulerLock(name = "PurgeBlacklist", lockAtLeastFor = "${app.jwt.blacklist.lock.least}", lockAtMostFor = "${app.jwt.blacklist.lock.most}")
	@Transactional
	public void scheduledPurgeBlacklist() {
		tokenBlacklistDao.deleteExpired(new Date(System.currentTimeMillis() - jwtTokenValidity * 1000));
	}

	private SecretKey getSigningKey() {
	    return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}

}