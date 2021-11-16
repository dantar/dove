package it.dantar.cav.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
public class Breadcrumbs {

	@Id
	String id;
	String idPosto;
	String idBreadcrumb;
	Integer sort;
	
}
