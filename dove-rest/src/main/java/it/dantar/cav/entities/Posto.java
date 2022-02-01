package it.dantar.cav.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

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
