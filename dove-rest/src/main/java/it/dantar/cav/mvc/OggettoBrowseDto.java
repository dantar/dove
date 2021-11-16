package it.dantar.cav.mvc;

import it.dantar.cav.entities.Oggetto;
import it.dantar.cav.entities.Posto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OggettoBrowseDto {

	Posto posto;
	Oggetto oggetto;
	
}
