package it.dantar.cav.entities;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OggettoOrdineDao extends JpaRepository<OggettoOrdine, String> {

	@Query("select o, oo from OggettoOrdine oo, Oggetto o "
			+ "where oo.idOggetto = o.id and oo.idOrdine = :idOrdine ")
	List<Object[]> findOggettiByOrdine(@Param("idOrdine") String idOrdine);

}
