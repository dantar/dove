package it.dantar.cav.entities;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenBlacklistDao extends JpaRepository<TokenBlacklist, String> {

	@Modifying
	@Query("delete from TokenBlacklist where timestamp < :date")
	public void deleteExpired(Date date);

}
