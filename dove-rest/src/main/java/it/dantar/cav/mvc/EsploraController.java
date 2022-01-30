package it.dantar.cav.mvc;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import it.dantar.cav.entities.Oggetto;
import it.dantar.cav.entities.OggettoDao;
import it.dantar.cav.entities.Posto;
import it.dantar.cav.entities.PostoDao;

@RestController
public class EsploraController {

	@Autowired
	private PostoDao postoDao; 
	@Autowired
	private OggettoDao oggettoDao; 
	@Autowired
	private PicturesService picturesService;
	
	@GetMapping("/browse/posto/{uuid}")
	public PostoBrowseDto browsePosto(@PathVariable("uuid") String uuid) {
		Posto posto = postoDao.findById(uuid).get();
		return new PostoBrowseDto(
				postoDao.findPostoBreadcrumbs(uuid),
				posto, 
				this.picturesService.caricaImmagini(oggettoDao.findByIdPosto(uuid)),
				postoDao.findByPercorso(
						posto.getPercorso() == null ? posto.getId().replace("-", "_") : String.format(
								"%s.%s", 
								posto.getPercorso(), 
								posto.getId().replace("-", "_"))
						));
	}

	@GetMapping("/browse/oggetto/{uuid}")
	public OggettoBrowseDto browseOggetto(@PathVariable("uuid") String uuid) {
		Optional<Oggetto> found = oggettoDao.findById(uuid);
		if (!found.isPresent()) {
			throw new RuntimeException("");
		}
		Oggetto oggetto = found.get();
		this.picturesService.caricaImmagini(oggetto);
		return new OggettoBrowseDto(
				postoDao.findPostoBreadcrumbs(uuid),
				postoDao.findById(oggetto.getIdPosto()).get(), 
				oggetto);
	}

}