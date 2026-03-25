package it.dantar.cav.mvc;

import java.util.List;

import it.dantar.cav.entities.Oggetto;
import it.dantar.cav.entities.Posto;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class AnyBrowseDto {

	List<Posto> breadcrumbs;
	Posto posto;
	Oggetto oggetto;
	List<Oggetto> oggetti;
	List<Posto> posti;
	
}
