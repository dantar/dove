package it.dantar.cav.security.jwt;

import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import it.dantar.cav.entities.TokenBlacklist;
import it.dantar.cav.entities.TokenBlacklistDao;
import it.dantar.cav.security.AppUserDetails;
import it.dantar.cav.security.authentication.mfa.InitMfaFlowToken;
import it.dantar.cav.security.authentication.mfa.InitMfaFlowTokenManager;
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

	private static final String JWT_TOKEN_TYPE = "stimare_type";

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.token.validity}")
	private long jwtTokenValidity;

	public String getUsernameFromToken(String token) {
		return getClaimFromToken(token, Claims::getSubject);
	}

	public Date getExpirationDateFromToken(String token) {
		return getClaimFromToken(token, Claims::getExpiration);
	}

	public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = getAllClaimsFromToken(token);
		return claimsResolver.apply(claims);
	}

	private Claims getAllClaimsFromToken(String token) {
		return Jwts
				.parserBuilder()
			    .setSigningKey(getSigningKey())
			    .build()
			    .parseClaimsJws(token)
			    .getBody();
	}

	private Boolean isTokenExpired(String token) {
		Optional<TokenBlacklist> blacklist = tokenBlacklistDao.findById(token);
		if (blacklist.isPresent()) {
			return true;
		}
		final Date expiration = getExpirationDateFromToken(token);
		return expiration.before(new Date());
	}

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

	public Boolean validateToken(String token, UserDetails userDetails) {
		final String username = getUsernameFromToken(token);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}

	public boolean isInitMfaFlowToken(String token) {
		String tokenType = (String) Jwts
				.parserBuilder()
			    .setSigningKey(getSigningKey())
			    .build()
			    .parseClaimsJws(token)
			    .getHeader()
			    .get(JWT_TOKEN_TYPE);
		return JWT_MFA_INIT_FLOW_TOKEN.equals(getClaimFromToken(token, Claims::getSubject)) && JWT_MFA_INIT_FLOW_TOKEN_TYPE.equals(tokenType);
	}

	public Authentication getInitMfaFlowToken(String jwtToken) {
		String secretKey = (String) getClaimFromToken(jwtToken, claim -> claim.get("secret"));
		String username = (String) getClaimFromToken(jwtToken, claim -> claim.get("username"));
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, null);
		return new InitMfaFlowToken(authenticationToken, secretKey,
				Arrays.asList(new SimpleGrantedAuthority(InitMfaFlowTokenManager.JWT_MFA_INIT_FLOW_TOKEN_AUTHORITY)));
	}
	
	public String getJwtToken(HttpServletRequest request) {
		final String requestTokenHeader = request.getHeader("Authorization");
		String jwtToken = null;
		if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
			jwtToken = requestTokenHeader.substring(7);
		}
		return jwtToken;
	}

	public void addToBlacklist(String t) {
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