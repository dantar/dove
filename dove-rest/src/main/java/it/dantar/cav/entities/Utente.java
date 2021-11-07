package it.dantar.cav.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

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
	String password;
	String hash;
	String salt;
	
	Boolean abilitato;
	Boolean accountValido;
	Boolean credenzialiValide;
	Boolean accountAttivo;
	
}
