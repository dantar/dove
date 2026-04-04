package it.dantar.cav.mvc;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import it.dantar.cav.entities.RepoSchemi;
import it.dantar.cav.entities.RepoSchemiDao;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SchemaController {

	private final RepoSchemiDao repoSchemiDao;
	
	@GetMapping("/schema/list")
	public List<RepoSchemi> schemaList() {
		return repoSchemiDao
				.findAll();
	}
	
}
