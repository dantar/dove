package it.dantar.cav.mvc;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

	@PostMapping("/posto")
	public Posto nuovoPosto(@RequestBody Posto posto) {
		if (posto.getId() == null) {			
			posto.setId(UUID.randomUUID().toString());
		}
		postoDao.save(posto);
		return posto;
	}

	@GetMapping("/oggetto/{uuid}")
	public Oggetto getOggetto(@PathVariable("uuid") String uuid) {
		return oggettoDao.findById(uuid).get();
	}

	@GetMapping("/oggetto")
	public List<Oggetto> getOggettoAll() {
		return oggettoDao.findAll();
	}

	@PostMapping("/oggetto")
	public Oggetto nuovoOggetto(@RequestBody Oggetto oggetto) {
		if (oggetto.getId() == null) {			
			oggetto.setId(UUID.randomUUID().toString());
		}
		oggettoDao.save(oggetto);
		return oggetto;
	}

}
