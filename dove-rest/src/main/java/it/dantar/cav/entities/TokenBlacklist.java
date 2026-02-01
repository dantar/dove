package it.dantar.cav.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import lombok.Data;

@Entity
@Data
public class TokenBlacklist {

	@Id
	String token;
	Date timestamp;
	
}
