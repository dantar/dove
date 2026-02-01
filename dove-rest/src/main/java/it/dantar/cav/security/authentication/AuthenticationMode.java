package it.dantar.cav.security.authentication;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AuthenticationMode {
	MFA("mfa");

	private String label;

}
