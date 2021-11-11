package it.dantar.cav.mvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import it.dantar.cav.entities.OggettoDao;
import it.dantar.cav.entities.PostoDao;

@RestController
public class EsploraController {

	@Autowired
	private PostoDao postoDao; 
	@Autowired
	private OggettoDao oggettoDao; 
	
	@GetMapping("/esplora/{uuid}")
	public EsploraDto esplora(@PathVariable("uuid") String uuid) {
		return new EsploraDto(postoDao.findById(uuid).get(), oggettoDao.findByIdPosto(uuid));
	}

}
