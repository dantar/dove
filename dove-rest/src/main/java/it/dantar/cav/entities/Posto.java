package it.dantar.cav.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
public class Posto {

	@Id
	String id;
	String nome;
	String percorso;
	
	@Transient
	public String getPathId() {
		return this.getId().replace("-", "_");
	}
}
