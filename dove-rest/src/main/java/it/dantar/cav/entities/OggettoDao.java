package it.dantar.cav.entities;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface OggettoDao extends JpaRepository<Oggetto, String> {

	List<Oggetto> findByIdPosto(String idPosto);

	@Modifying
	@Query("update Oggetto o set o.id = :prefix || ':' || o.id where o.id = :idOggetto")
	void dropOggetto(String idOggetto, String prefix);

}
