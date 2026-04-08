package it.dantar.cav.entities;

import java.util.Optional;

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
	String thumbnail;
	
	@Transient
	public String getPathId() {
		return Optional.ofNullable(this.getId()).map(i -> i.replace("-", "_")).orElse(null);
	}
	
	@Transient
	public String getRepo() {
		return Optional
				.ofNullable(percorso)
				.map(p -> p.split("\\."))
				.filter(a -> a.length > 0)
				.map(a -> a[0])
				.map(p -> p.replace("_", "-"))
				.orElse(id);
	}
	
}
