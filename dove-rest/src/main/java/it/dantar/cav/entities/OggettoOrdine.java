package it.dantar.cav.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@NoArgsConstructor
@Entity
public class OggettoOrdine {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String idOggetto;
	private String idOrdine;
	private String stato;
	
	public OggettoOrdine(String idOggetto, String idOrdine) {
		super();
		this.idOggetto = idOggetto;
		this.idOrdine = idOrdine;
		this.stato = "selezionato";
	}
	
}
