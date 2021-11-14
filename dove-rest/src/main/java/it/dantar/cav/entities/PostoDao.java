package it.dantar.cav.entities;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostoDao extends JpaRepository<Posto, String> {

	List<Posto> findByPercorso(String format);

}
