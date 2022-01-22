package it.dantar.cav.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name="utente")
public class Utente {

	@Id
	String id;
	String username;
	@JsonIgnore
	String password;
	@JsonIgnore
	String hash;
	@JsonIgnore
	String salt;
	
	Boolean abilitato;
	Boolean accountValido;
	Boolean credenzialiValide;
	Boolean accountAttivo;
	
}
