package it.dantar.cav.security;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import it.dantar.cav.entities.Utente;


@SuppressWarnings("serial")
public class AppUserDetails extends User {

	Utente utente;
	
	public AppUserDetails() {
		// spring user
		super("", "", new ArrayList<SimpleGrantedAuthority>());
	}
	
	public AppUserDetails(String username, String password) {
		// spring user
		super(username, password, new ArrayList<SimpleGrantedAuthority>());
	}

	public AppUserDetails(String username, String password,
			Boolean enabled, Boolean validAccount, Boolean validCredentials, Boolean activeAccount,
			Collection<? extends GrantedAuthority> authorities) {
		// spring user
		super(username, password, enabled, validAccount, validCredentials, activeAccount, authorities);
	}
	
	public static AppUserDetails loggedUser() {
		return (AppUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}

	public Utente getUtente() {
		return utente;
	}

	public AppUserDetails setUtente(Utente utente) {
		this.utente = utente;
		return this;
	}

	public boolean hasAuthority(String authority) {
		return this.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(authority));
	}
	
}
