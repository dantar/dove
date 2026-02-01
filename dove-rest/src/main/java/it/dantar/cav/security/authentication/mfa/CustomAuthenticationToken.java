package it.dantar.cav.security.authentication.mfa;

import java.util.Collection;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import lombok.Data;

@Data
public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {

	private static final long serialVersionUID = -5383631157081285829L;
	private String otp;

	public CustomAuthenticationToken(Object principal, Object credentials, String otp) {
		super(principal, credentials);
		this.otp = otp;
	}

	public CustomAuthenticationToken(Object principal, Object credentials, String otp, Collection<? extends GrantedAuthority> authorities) {
		super(principal, credentials, authorities);
		this.otp = otp;
	}

}