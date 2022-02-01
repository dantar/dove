package it.dantar.cav.mvc;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import it.dantar.cav.entities.Oggetto;

@RestController
public class SearchController {

	@PersistenceContext
	private EntityManager em;

	@SuppressWarnings("unchecked")
	@GetMapping("/oggetto/{tipo}/list")
	public List<Oggetto> browseRoot(@PathVariable String tipo) {
		return em
		.createNamedQuery("Oggetto.allByTipo")
		.setParameter("tipo", tipo)
		.getResultList()
		;
	}
	
}
