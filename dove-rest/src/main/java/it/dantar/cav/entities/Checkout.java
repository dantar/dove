package it.dantar.cav.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.databind.JsonNode;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
@Entity
public class Checkout {

	@Id
	String id;
	String repo;
	@Type(JsonBinaryType.class)
	JsonNode scheda;
	@Type(JsonBinaryType.class)
	JsonNode oggetto;
	@Column(name = "registrato", insertable = false, updatable = false)
	private LocalDateTime registrato;
	@Column(name = "modificato", insertable = false, updatable = false)
	private LocalDateTime modificato;
	
}
