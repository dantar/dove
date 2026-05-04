package it.dantar.cav.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class UtenteRepo {

	@Id
	private String id;
	private String idUtente;
	private String idRepo;

}
