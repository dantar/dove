package it.dantar.cav.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.dantar.cav.security.jwt.JwtTokenService;
import it.dantar.cav.security.jwt.JwtUser;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@CrossOrigin
@Slf4j
@RequiredArgsConstructor
public class AuthenticationController {
	
	private final AuthenticationManager authenticationManager;
	private final JwtTokenService jwtTokenUtil;
	private final AppUserDetailsService userDetailsService;
	private final PasswordEncoder encoder;

	@Value("${app.url}")
	private String appUrl;

	@Data
	public static class LoginDataForm {
		String username;
		String password;
	}
	
	@PostMapping(value = "/authenticate")
	public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginDataForm form, HttpServletResponse response) throws Exception {
		log.debug("Authenticating {}", form);
		AppUserDetails user = userDetailsService.loadUserByUsername(form.getUsername());
		if (user != null) {
			String salt = user.getUtente().getSalt();
			authenticate(form.getUsername(), salt != null ? form.getPassword() + salt: form.getPassword());
			AppUserDetails details = user;
			String token = jwtTokenUtil.generateAuthenticationTokenForUser(details);
		    response.addCookie(newCookie(token, 24 * 60 * 60));
			return ResponseEntity
					.ok(new JwtUser<UserDetails>()
							.setDetails(details)
							.setToken(token)
							);
		} else {
			return  ResponseEntity
	                .status(HttpStatus.UNAUTHORIZED)
	                .body("Utente o password errati");
		}
	}

	private Cookie newCookie(String token, int age) {
		Cookie cookie = new Cookie("auth_token", token);
		cookie.setHttpOnly(true);
		cookie.setSecure(appUrl.startsWith("https"));
		cookie.setPath("/");
		cookie.setMaxAge(age);
		return cookie;
	}

	@GetMapping(value = "/hash")
	public String hashPassword(@RequestParam String password) throws Exception {
		return encoder.encode(password);
	}

	@GetMapping("/user")
	public AppUserDetails alive() {
		return AppUserDetails.loggedUser();
	}

	private void authenticate(String username, String password) throws Exception {
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
		} catch (DisabledException e) {
			throw new RuntimeException("USER_DISABLED", e);
		} catch (RuntimeException e) {
			e.printStackTrace();
			throw new RuntimeException("INVALID_AUTH_DATA", e);
		}
	}
	
}