package it.dantar.cav.mvc;

import java.util.Optional;

import org.springframework.stereotype.Service;

import it.dantar.cav.entities.OggettoDao;
import it.dantar.cav.entities.PostoDao;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BrokerService {

	private final PostoDao postoDao; 
	private final OggettoDao oggettoDao; 
	
	public AnyByUuid getById(String uuid) {
		AnyByUuid result = new AnyByUuid()
				.setOggetto(oggettoDao.findById(uuid));
		if (result.getOggetto().isPresent()) {
			result.setPosto(Optional.empty());
		} else {
			result.setPosto(postoDao.findById(uuid));
		}
		return result;
	}

}
