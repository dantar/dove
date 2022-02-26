package it.dantar.cav.entities;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrdineDao extends JpaRepository<Ordine, String> {

	@Query("select o, c from Ordine o, Cliente c, UtenteCliente uc "
			+ "where o.idCliente = c.id and uc.idCliente = c.id and uc.idUtente = :idUtente and o.stato = :stato")
	List<Object[]> findByUtenteAndStato(@Param("idUtente") String idUtente, @Param("stato") String stato);

}
