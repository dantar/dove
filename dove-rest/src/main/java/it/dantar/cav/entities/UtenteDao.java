package it.dantar.cav.entities;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UtenteDao extends JpaRepository<Utente, String> {

	Optional<Utente> findByUsername(String username);

}
