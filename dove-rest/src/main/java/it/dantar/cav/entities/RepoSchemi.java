package it.dantar.cav.entities;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.databind.node.ArrayNode;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
public class RepoSchemi {

	@Id
	String id;
	@Type(JsonBinaryType.class)
	ArrayNode schemi;
	
}
