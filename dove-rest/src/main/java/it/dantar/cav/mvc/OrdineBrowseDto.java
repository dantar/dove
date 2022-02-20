package it.dantar.cav.mvc;

import java.util.List;

import it.dantar.cav.entities.Cliente;
import it.dantar.cav.entities.Oggetto;
import it.dantar.cav.entities.OggettoOrdine;
import it.dantar.cav.entities.Ordine;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@AllArgsConstructor
@Accessors(chain = true)
public class OrdineBrowseDto {

	@Data
	@Accessors(chain = true)
	@AllArgsConstructor
	static public class OggettoInOrdineDto {
		private Oggetto oggetto;
		private OggettoOrdine relazione;
		public OggettoInOrdineDto(Object[] row) {
			super();
			this.oggetto = (Oggetto) row[0];
			this.relazione = (OggettoOrdine) row[1];
		}		
	}
	
	private Ordine ordine;
	private Cliente cliente;
	private List<OggettoInOrdineDto> oggetti;
	
	public static OrdineBrowseDto rowNew(Object[] row) {
		return new OrdineBrowseDto((Ordine) row[0], (Cliente) row[1], null);
	}
	
}
