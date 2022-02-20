package it.dantar.cav.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.annotations.Parameter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@TypeDef(
		name = "jsonb", 
		typeClass = JsonBinaryType.class, 
		parameters = {@Parameter(name = "classType", value = "com.fasterxml.jackson.databind.JsonNode")}
		)
public class Ordine {

	@Id
	private String id;
	private String idCliente;
	@Type(type = "jsonb")
	private JsonNode scheda;
	private String stato;
	
}
