package it.dantar.cav.entities;

import org.hibernate.annotations.Type;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Cliente {

	@Id
	private String id;
	private String nome;
	@Type(JsonBinaryType.class)
	private String scheda;
	
}
