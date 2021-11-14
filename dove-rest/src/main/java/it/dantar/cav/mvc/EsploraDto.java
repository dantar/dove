package it.dantar.cav.mvc;

import java.util.List;

import it.dantar.cav.entities.Oggetto;
import it.dantar.cav.entities.Posto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EsploraDto {

	Posto posto;
	List<Oggetto> oggetti;
	List<Posto> posti;
	
}
