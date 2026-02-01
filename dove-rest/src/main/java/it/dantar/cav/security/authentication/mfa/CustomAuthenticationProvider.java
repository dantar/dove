package it.dantar.cav.security.authentication.mfa;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import it.dantar.cav.security.AppUserDetails;
import it.dantar.cav.security.AppUserDetailsService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomAuthenticationProvider extends DaoAuthenticationProvider {

	@Autowired
	private AppUserDetailsService appUserDetailsService;

	@Autowired
	private InitMfaFlowTokenManager mfaTokenManager;

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {

		if (authentication.getClass().equals(CustomAuthenticationToken.class)) {

			CustomAuthenticationToken customAuthenticationToken = (CustomAuthenticationToken) authentication;
			AppUserDetails user = retrieveUser(customAuthenticationToken.getName());

			final String otp = customAuthenticationToken.getOtp();
			if (user.isMfaEnalbed()) {
				if (!Objects.isNull(user.getMfaSecret())) {
					if (!mfaTokenManager.verifyTotp(otp, user.getMfaSecret())) {
						log.debug("Invalid otp for user: {}", user.getUsername());
						throw new BadCredentialsException("Invalid OTP");
					}
				} else {
					log.debug(String.format("Need to generate secret for user %s", user.getUsername()));
				}
			}

			final Authentication result = super.authenticate(authentication);
			return new UsernamePasswordAuthenticationToken(user, result.getCredentials(), result.getAuthorities());
		}
		throw new InternalAuthenticationServiceException(String.format("Unexpected type of Authentication token %s", authentication.getClass().toString()));
	}

	private AppUserDetails retrieveUser(String username) {
		AppUserDetails loadedUser = appUserDetailsService.loadUserByUsername(username);
		if (loadedUser == null) {
			throw new InternalAuthenticationServiceException(
					"UserDetailsService returned null, which is an interface contract violation: invalid username or password");
		}
		return loadedUser;
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
	}
}
