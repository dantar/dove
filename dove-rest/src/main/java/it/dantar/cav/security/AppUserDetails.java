package it.dantar.cav.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import com.fasterxml.jackson.annotation.JsonIgnore;

import it.dantar.cav.entities.Posto;
import it.dantar.cav.entities.RepoSchemi;
import it.dantar.cav.entities.Utente;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@EqualsAndHashCode(callSuper=false)
public class AppUserDetails extends User {

	private static final long serialVersionUID = 923009708029155856L;
	
	@Data
	@AllArgsConstructor
	public static class RepoInfo {
		Posto root;
		RepoSchemi schemi;
	}
	
	Utente utente;
	List<RepoInfo> repos;
	
	public AppUserDetails() {
		// spring user
		super("", "", new ArrayList<>());
	}
	
	public AppUserDetails(String username, String password) {
		// spring user
		super(username, password, new ArrayList<>());
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

	public boolean hasAuthority(String authority) {
		return this.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(authority));
	}
	
	@Override
	@JsonIgnore
	public String getPassword() {
		return super.getPassword();
	}

	public boolean isMfaEnalbed() {
		// TODO Auto-generated method stub
		return false;
	}

	@JsonIgnore
	public String getMfaSecret() {
		// TODO Auto-generated method stub
		return null;
	}
	
}
