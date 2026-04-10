package it.dantar.cav.mvc;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import it.dantar.cav.entities.Oggetto;
import it.dantar.cav.entities.OggettoDao;
import it.dantar.cav.mvc.SearchService.SearchRequestForm;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SearchController {

	@PersistenceContext
	private EntityManager em;
	private final OggettoDao oggettoDao;
	private final SearchService searchService;

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
		List<Oggetto> result = new ArrayList<>();
		List<Oggetto> all = oggettoDao.findAll();
		for(int i = 0; i<1; i++) {
			result.addAll(all);
		}
		return result;
	}
	
	@PostMapping("/search/oggetto")
	public Page<Oggetto> search(@RequestBody SearchRequestForm search) {
		return this.searchService.search(search);
	}	
	
}
