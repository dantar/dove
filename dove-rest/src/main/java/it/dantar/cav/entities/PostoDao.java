package it.dantar.cav.entities;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostoDao extends JpaRepository<Posto, String> {

	List<Posto> findByPercorso(String format);
	
	@Query("select p from Posto p, Breadcrumbs b where p.id = b.idBreadcrumb and b.idPosto = :uuid order by b.sort")
	List<Posto> findPostoBreadcrumbs(String uuid);

}
