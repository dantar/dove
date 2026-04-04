package it.dantar.cav.entities;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepoSchemiDao extends JpaRepository<RepoSchemi, String> {

}
