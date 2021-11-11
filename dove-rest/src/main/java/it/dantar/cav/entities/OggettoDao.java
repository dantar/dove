package it.dantar.cav.entities;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OggettoDao extends JpaRepository<Oggetto, String> {

	List<Oggetto> findByIdPosto(String idPosto);
	
}
