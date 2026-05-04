package it.dantar.cav.security;

import java.util.ArrayList;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import it.dantar.cav.entities.Posto;
import it.dantar.cav.entities.RepoSchemi;
import it.dantar.cav.entities.Utente;
import it.dantar.cav.entities.UtenteDao;
import it.dantar.cav.entities.UtenteRepoDao;
import it.dantar.cav.security.AppUserDetails.RepoInfo;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

	private final PasswordEncoder passwordEncoder;
	private final UtenteDao utenteDao;
	private final UtenteRepoDao utenteRepoDao;

	public AppUserDetails loadUserByUsername(String username) {
		Utente utenti = utenteDao.findByUsername(username).orElseThrow();
		ArrayList<GrantedAuthority> authorities = new ArrayList<>();
		authorities.add(new SimpleGrantedAuthority("user"));
		return new AppUserDetails(
				utenti.getUsername(), hashPassword(utenti),
				utenti.getAbilitato(), utenti.getAccountValido(), utenti.getCredenzialiValide(), utenti.getAccountAttivo(), 
				authorities
				)
				.setUtente(utenti)
				.setRepos(
						utenteRepoDao
						.findByUsername(username)
						.stream()
						.map(row -> new RepoInfo(
								(Posto) row[0],
								(RepoSchemi) row[1]
								))
						.toList()
						)
				;
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
