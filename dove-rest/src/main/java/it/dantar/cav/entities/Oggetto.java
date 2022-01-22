package it.dantar.cav.entities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.hibernate.annotations.Parameter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@TypeDef(
		name = "jsonb", 
		typeClass = JsonBinaryType.class, 
		parameters = {
				@Parameter(name = "classType", value = "com.fasterxml.jackson.databind.JsonNode") 
				}
		)
public class Oggetto {

	@Id
	String id;
	String idPosto;
	String nome;
	@Type(type = "jsonb")
	JsonNode scheda;
	@Transient
	List<String> immagini = new ArrayList<>();

}
