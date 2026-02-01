package it.dantar.cav.security.authentication.mfa;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import it.dantar.cav.security.AppUserDetails;
import it.dantar.cav.security.AppUserDetailsService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class InitMfaFlowValidationProvider extends DaoAuthenticationProvider {

	@Autowired
	private AppUserDetailsService userDetailsService;

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {

		InitMfaFlowToken otpValidationToken = (InitMfaFlowToken) authentication;
		AppUserDetails loadedUser = userDetailsService.loadUserByUsername((String) otpValidationToken.getPrincipal());

		if (loadedUser.isMfaEnalbed() && !Objects.isNull(loadedUser.getMfaSecret())) {
			log.debug("Invalid state of MFA flow");
			throw new BadCredentialsException("Invalid state");
		}
		return authentication;
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(InitMfaFlowToken.class);
	}
}
