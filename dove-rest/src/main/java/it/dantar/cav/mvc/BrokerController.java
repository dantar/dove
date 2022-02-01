package it.dantar.cav.mvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import it.dantar.cav.entities.OggettoDao;
import it.dantar.cav.entities.PostoDao;

@RestController
public class BrokerController {

	@Autowired
	private PostoDao postoDao; 
	@Autowired
	private OggettoDao oggettoDao; 
	
	@GetMapping("/broker/{uuid}")
	public BrokerDto browsePosto(@PathVariable("uuid") String uuid) {
		return new BrokerDto(
				this.postoDao.findById(uuid).orElse(null),
				this.oggettoDao.findById(uuid).orElse(null)
				);
	}

}
