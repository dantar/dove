package it.dantar.cav.entities;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UtenteRepoDao extends JpaRepository<UtenteRepo, String> {

	@Query("select p, rs "
			+ "from Utente u, UtenteRepo ur, Posto p, RepoSchemi rs "
			+ "where rs.id = ur.idRepo "
			+ "and p.id = ur.idRepo "
			+ "and ur.idUtente = u.id "
			+ "and u.username = :username ")
	List<Object[]> findByUsername(String username);

}
