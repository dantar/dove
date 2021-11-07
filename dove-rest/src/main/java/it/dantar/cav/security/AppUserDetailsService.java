package it.dantar.cav.security;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import it.dantar.cav.entities.Utente;
import it.dantar.cav.entities.UtenteDao;

@Component
public class AppUserDetailsService implements UserDetailsService {

	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private UtenteDao utenteDao;

	public AppUserDetails loadUserByUsername(String username) {
		// authentication: should have username and encoded password
		// authorization: should have appropriate grants
		Utente utenti = utenteDao.findByUsername(username).get();
		return new AppUserDetails(
				utenti.getUsername(), hashPassword(utenti),
				utenti.getAbilitato(), utenti.getAccountValido(), utenti.getCredenzialiValide(), utenti.getAccountAttivo(), 
				new ArrayList<GrantedAuthority>()
				)
				.setUtente(utenti);
	}
	
	private String hashPassword(Utente utenti) {
		switch (utenti.getHash()) {
		case "plain":
			return passwordEncoder.encode(utenti.getPassword() + (utenti.getSalt() == null ? "" : utenti.getSalt()));
		default:
			return utenti.getPassword();
		}
	}

}
