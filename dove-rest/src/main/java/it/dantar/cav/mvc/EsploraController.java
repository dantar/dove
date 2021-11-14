package it.dantar.cav.mvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import it.dantar.cav.entities.OggettoDao;
import it.dantar.cav.entities.Posto;
import it.dantar.cav.entities.PostoDao;

@RestController
public class EsploraController {

	@Autowired
	private PostoDao postoDao; 
	@Autowired
	private OggettoDao oggettoDao; 
	
	@GetMapping("/esplora/{uuid}")
	public EsploraDto esplora(@PathVariable("uuid") String uuid) {
		Posto posto = postoDao.findById(uuid).get();
		return new EsploraDto(
				posto, 
				oggettoDao.findByIdPosto(uuid),
				postoDao.findByPercorso(
						posto.getPercorso() == null ? posto.getId().replace("-", "_") : String.format(
								"%s.%s", 
								posto.getPercorso(), 
								posto.getId().replace("-", "_"))
						));
	}

}
