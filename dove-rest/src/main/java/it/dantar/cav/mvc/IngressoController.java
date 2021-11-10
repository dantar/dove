package it.dantar.cav.mvc;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import it.dantar.cav.entities.Oggetto;
import it.dantar.cav.entities.OggettoDao;
import it.dantar.cav.entities.Posto;
import it.dantar.cav.entities.PostoDao;

@RestController
public class IngressoController {

	@Autowired
	private PostoDao postoDao; 
	@Autowired
	private OggettoDao oggettoDao; 
	
	@GetMapping("/posto/{uuid}")
	public Posto getPosto(@PathVariable("uuid") String uuid) {
		return postoDao.findById(uuid).get();
	}

	@GetMapping("/posto")
	public List<Posto> getPostoAll() {
		return postoDao.findAll();
	}

	@GetMapping("/oggetto/{uuid}")
	public Oggetto getOggetto(@PathVariable("uuid") String uuid) {
		return oggettoDao.findById(uuid).get();
	}

	@GetMapping("/oggetto")
	public List<Oggetto> getOggettoAll() {
		return oggettoDao.findAll();
	}

}
