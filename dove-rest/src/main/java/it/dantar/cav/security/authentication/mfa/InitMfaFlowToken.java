package it.dantar.cav.security.authentication.mfa;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;

import lombok.Data;

@Data
public class InitMfaFlowToken extends AbstractAuthenticationToken {

	private static final long serialVersionUID = 4345815901885970854L;

	private final Authentication authenticationToken;

	private String secretKey;

	public InitMfaFlowToken(Authentication authenticationToken, String secret) {
		super(Collections.emptyList());
		this.authenticationToken = authenticationToken;
		this.secretKey = secret;
	}

	public InitMfaFlowToken(Authentication authenticationToken, String secret, Collection<? extends GrantedAuthority> authorities) {
		super(authorities);
		this.authenticationToken = authenticationToken;
		this.secretKey = secret;
	}

	@Override
	public void eraseCredentials() {
		if (this.authenticationToken instanceof CredentialsContainer) {
			((CredentialsContainer) this.authenticationToken).eraseCredentials();
		}
	}

	@Override
	public Object getCredentials() {
		return this.authenticationToken.getCredentials();
	}

	@Override
	public Object getPrincipal() {
		return this.authenticationToken.getPrincipal();
	}

	@Override
	public boolean isAuthenticated() {
		return false;
	}

}