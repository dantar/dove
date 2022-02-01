package it.dantar.cav.mvc;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

	@GetMapping("/browse/root")
	public PostoBrowseDto browseRoot() {
		Posto posto = postoDao.findRoot().orElseThrow(() -> new IllegalArgumentException());
		return new PostoBrowseDto(
				new ArrayList<Posto>(),
				posto, 
				this.picturesService.caricaImmagini(oggettoDao.findByIdPosto(posto.getId())),
				postoDao.findByPercorso(posto.getPathId())
				);
	}

	@GetMapping("/browse/posto/{uuid}")
	public PostoBrowseDto browsePosto(@PathVariable("uuid") String uuid) {
		Posto posto = postoDao.findById(uuid).get();
		return new PostoBrowseDto(
				postoDao.findPostoBreadcrumbs(uuid),
				posto, 
				this.picturesService.caricaImmagini(oggettoDao.findByIdPosto(uuid)),
				postoDao.findByPercorso(
						posto.getPercorso() == null ? 
								posto.getPathId() 
								: String.format("%s.%s", posto.getPercorso(), posto.getPathId())
						));
	}

	@PostMapping("/browse/posto/{uuid}/add/{item}")
	public PostoBrowseDto browsePostoAddItem(@PathVariable("uuid") String uuid, @PathVariable("item") String item) {
		Optional<Oggetto> found = oggettoDao.findById(item);
		Oggetto oggetto = found.orElse(new Oggetto().setId(item));
		oggetto.setIdPosto(uuid);
		oggettoDao.save(oggetto);
		return this.browsePosto(uuid);
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
