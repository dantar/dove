package it.dantar.cav.entities;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.Data;

@Data
public class SchedaSchemaJson {
	
	String id;
	String nome;
	List<JsonNode> campi;

}
