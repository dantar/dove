package it.dantar.cav.entities;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CheckoutDao extends JpaRepository<Checkout, String>, JpaSpecificationExecutor<Checkout> {

}
