package it.dantar.cav.mvc;

import java.util.Optional;

import it.dantar.cav.entities.Oggetto;
import it.dantar.cav.entities.Posto;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class AnyByUuid {

	String uuid;
	Optional<Oggetto> oggetto;
	Optional<Posto> posto;
	
}
