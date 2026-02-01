package it.dantar.cav.security;

import org.springframework.beans.factory.annotation.Autowired;
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
import lombok.Data;

@RestController
@CrossOrigin
public class AuthenticationController {
	
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private JwtTokenService jwtTokenUtil;
	@Autowired
	private AppUserDetailsService userDetailsService;
	@Autowired
	private PasswordEncoder encoder;

	@Data
	public static class LoginDataForm {
		String username;
		String password;
	}
	
	@PostMapping(value = "/authenticate")
	public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginDataForm form) throws Exception {
		AppUserDetails user = userDetailsService.loadUserByUsername(form.getUsername());
		if (user != null) {
			String salt = user.getUtente().getSalt();
			authenticate(form.getUsername(), salt != null ? form.getPassword() + salt: form.getPassword());
			UserDetails details = user;
			return ResponseEntity.ok(new JwtUser<UserDetails>()
					.setDetails(details)
					.setToken(jwtTokenUtil.generateAuthenticationTokenForUser(details)));
		} else {
			return  ResponseEntity
	                .status(HttpStatus.UNAUTHORIZED)
	                .body("Utente o password errati");
		}
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