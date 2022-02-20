package it.dantar.cav.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.annotations.Parameter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;

import lombok.Data;

@Data
@Entity
@TypeDef(
		name = "jsonb", 
		typeClass = JsonBinaryType.class, 
		parameters = {@Parameter(name = "classType", value = "com.fasterxml.jackson.databind.JsonNode")}
		)
public class Cliente {

	@Id
	private String id;
	private String nome;
	@Type(type = "jsonb")
	private String scheda;
	
}
