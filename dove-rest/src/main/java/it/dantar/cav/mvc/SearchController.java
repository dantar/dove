package it.dantar.cav.mvc;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import it.dantar.cav.entities.Oggetto;
import it.dantar.cav.entities.OggettoDao;

@RestController
public class SearchController {

	@PersistenceContext
	private EntityManager em;
	@Autowired
	private OggettoDao oggettoDao;

	@SuppressWarnings("unchecked")
	@GetMapping("/oggetto/{tipo}/list")
	public List<Oggetto> browseAccessorio(@PathVariable String tipo) {
		return em
		.createNamedQuery("Oggetto.allByTipo")
		.setParameter("tipo", tipo)
		.getResultList()
		;
	}
	
	@GetMapping("/oggetto/list")
	public List<Oggetto> browseAll() {
		return oggettoDao.findAll();
	}
	
}
