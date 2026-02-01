package it.dantar.cav.entities;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.databind.JsonNode;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedNativeQuery;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@NamedNativeQuery(
		name = "Oggetto.allByTipo",
		query = "select * from oggetto o where o.scheda->>'tipo' = :tipo or true",
		resultClass = Oggetto.class
)

@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
@Entity
public class Oggetto {

	@Id
	String id;
	String idPosto;
	String nome;
	String thumbnail;
	@Type(JsonBinaryType.class)
	JsonNode scheda;
	@Transient
	List<String> immagini = new ArrayList<>();

}
