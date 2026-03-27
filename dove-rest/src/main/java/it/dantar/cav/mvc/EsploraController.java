package it.dantar.cav.mvc;

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
import lombok.Data;
import lombok.experimental.Accessors;

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
		return new PostoBrowseDto(
				null,
				null, 
				null,
				postoDao.findRoot()
				);
	}

	@GetMapping("/browse/posto/{uuid}")
	public PostoBrowseDto browsePosto(@PathVariable("uuid") String uuid) {
		Optional<Posto> p = postoDao.findById(uuid);
		if (p.isEmpty()) {
			throw new RuntimeException();
		}
		Posto posto = p.get();
		return browsePosto(posto);
	}

	private PostoBrowseDto browsePosto(Posto posto) {
		return new PostoBrowseDto(
				postoDao.findPostoBreadcrumbs(posto.getId()),
				posto, 
				oggettoDao.findByIdPosto(posto.getId()),
				postoDao.findByPercorso(
						posto.getPercorso() == null ? 
								posto.getPathId() 
								: String.format("%s.%s", posto.getPercorso(), posto.getPathId())
						));
	}

	@PostMapping("/browse/posto/{uuid}/add/{item}")
	public PostoBrowseDto browsePostoAddItem(@PathVariable("uuid") String uuid, @PathVariable("item") String item) {
		Optional<Oggetto> found = oggettoDao.findById(item);
		Oggetto oggetto = found.orElse(
				new Oggetto()
				.setId(item)
				.setThumbnail("")
				);
		oggetto.setIdPosto(uuid);
		oggettoDao.save(oggetto);
		return this.browsePosto(uuid);
	}

	@GetMapping("/browse/oggetto/{uuid}")
	public OggettoBrowseDto browseOggetto(@PathVariable("uuid") String uuid) {
		Optional<Oggetto> found = oggettoDao.findById(uuid);
		if (!found.isPresent()) {
			throw new RuntimeException();
		}
		return browseOggetto(found.get());
	}

	private OggettoBrowseDto browseOggetto(Oggetto oggetto) {
		this.picturesService.caricaImmagini(oggetto);
		return new OggettoBrowseDto(
				postoDao.findPostoBreadcrumbs(oggetto.getIdPosto()),
				postoDao.findById(oggetto.getIdPosto()).get(), 
				oggetto);
	}
	
	@GetMapping("/any/{uuid}/browse")
	public AnyBrowseDto browseAny(@PathVariable("uuid") String uuid) {
		Optional<Oggetto> oggetto = oggettoDao.findById(uuid);
		if (oggetto.isPresent()) {
			OggettoBrowseDto bo = browseOggetto(oggetto.get());
			return new AnyBrowseDto()
					.setBreadcrumbs(bo.getBreadcrumbs())
					.setOggetto(bo.getOggetto())
					.setPosto(bo.getPosto())
					;
		}
		Optional<Posto> posto = postoDao.findById(uuid);
		if (posto.isPresent()) {
			PostoBrowseDto bo = browsePosto(posto.get());
			return new AnyBrowseDto()
					.setBreadcrumbs(bo.getBreadcrumbs())
					.setPosto(bo.getPosto())
					.setPosti(bo.getPosti())
					.setOggetti(bo.getOggetti())
					;
		}
		throw new RuntimeException();
	}

	@Data
	@Accessors(chain = true)
	public static class AnyDto {
		String id;
		String tipo;
		Oggetto oggetto;
		Posto posto;
	}
	
	@GetMapping("/any/{uuid}")
	public AnyDto fetchAnyObj(@PathVariable("uuid") String uuid) {
		Optional<Oggetto> oggetto = oggettoDao.findById(uuid);
		if (oggetto.isPresent()) {
			return new AnyDto()
					.setId(uuid)
					.setTipo("oggetto")
					.setOggetto(oggetto.get())
					;
		}
		Optional<Posto> posto = postoDao.findById(uuid);
		if (posto.isPresent()) {
			return new AnyDto()
					.setId(uuid)
					.setTipo("posto")
					.setPosto(posto.get())
					;
		}
		return new AnyDto()
				.setId(uuid);
	}

}
