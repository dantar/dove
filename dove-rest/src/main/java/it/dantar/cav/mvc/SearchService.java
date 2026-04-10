package it.dantar.cav.mvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.dantar.cav.entities.Oggetto;
import it.dantar.cav.entities.OggettoDao;
import it.dantar.cav.entities.RepoSchemi;
import it.dantar.cav.entities.RepoSchemiDao;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.Predicate;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;

@Service
@RequiredArgsConstructor
public class SearchService {

	public static final String VALUES = "values";
	public static final String SCHEDA = "scheda";
	
	@PersistenceContext
	private EntityManager em;
	private final OggettoDao oggettoDao;
	private final RepoSchemiDao repoSchemiDao;

	@Data
	private static class SpecificationBuilderRegistry<T> {
		private Map<String, SpecificationBuilder<T>> registry = new HashMap<>();

		public SpecificationBuilderRegistry<T> registerSpecificationBuilder(String key, SpecificationBuilder<T> sb) {
			registry.put(key, sb);
			return this;
		}

		public SpecificationBuilder<T> getSpecificationBuilder(String tipo) {
			return registry.get(tipo);
		}
	}
	
	protected static final SpecificationBuilderRegistry<Oggetto> SPECBUILDER = new SpecificationBuilderRegistry<Oggetto>()
			.registerSpecificationBuilder("text", (worker, campo, criteria) -> (oggetto, query, cb) ->
			cb.like(
					cb.function("jsonb_extract_path_text", String.class, oggetto.get(SCHEDA), cb.literal(VALUES), cb.literal(campo.getId())),
					"%" + criteria.getCriteria().path("text").asText() + "%"
					))
			;
	
	private static interface SpecificationBuilder<T> {
		Specification<T> toSpecification(SchemaWorker worker, SchemaCampoReader campo, SearchRequestFormCriteria criteria);
	}
	
	@Data
	public static class SearchRequestFormCriteria {
		String schema;
		String campo;
		JsonNode criteria;
	}
	
	@Data
	public static class SearchRequestForm {
		String repo;
		List<SearchRequestFormCriteria> query;
	}

	public Page<Oggetto> search(SearchRequestForm search) {
		RepoWorker worker = repoSchemiDao
				.findById(search.getRepo())
				.map(repo -> RepoWorker.wrap(repo))
				.orElseThrow(IllegalArgumentException::new);
		List<Specification<Oggetto>> specifications = search.query.stream().map(criteria -> worker.toSpecification(criteria)).toList();
		return oggettoDao.findAll(andAllCriteria(specifications), PageRequest.of(0, 10));
	}

	private Specification<Oggetto> andAllCriteria(List<Specification<Oggetto>> criteria) {
		return (root, query, cb) -> cb.and(
				criteria.stream()
				.map(s -> s.toPredicate(root, query, cb))
    			.toList()
    			.toArray(new Predicate[0])
    			)
        ;
	}

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	private static class SchemaReader {
		String id;
		String nome;
		List<SchemaCampoReader> campi;
	}

	@Data
	@JsonIgnoreProperties(ignoreUnknown = true)
	private static class SchemaCampoReader {
		String id;
		String nome;
		String tipo;
	}

	@Data
	private static class SchemaWorker {
		ObjectMapper mapper;
		RepoWorker repo;
		JsonNode schema;
		SchemaReader reader;
		@SneakyThrows
		static SchemaWorker wrap(RepoWorker repo, JsonNode schema) {
			ObjectMapper mapper = new ObjectMapper();
			SchemaWorker worker = new SchemaWorker();
			worker.setMapper(mapper);
			worker.setRepo(repo);
			worker.setSchema(schema);
			worker.setReader(mapper.treeToValue(schema, SchemaReader.class));
			return worker;
		}
		public Specification<Oggetto> toSpecification(SearchRequestFormCriteria criteria) {
			return this.reader.getCampi()
			.stream()
			.filter(c -> Objects.equals(c.getId(), criteria.getCampo()))
			.findAny()
			.map(campo -> this.toSpecification(campo, criteria))
			.orElseThrow(IllegalArgumentException::new)
			;
		}
		private Specification<Oggetto> toSpecification(SchemaCampoReader campo, SearchRequestFormCriteria criteria) {
			return SPECBUILDER
					.getSpecificationBuilder(campo.getTipo())
					.toSpecification(this, campo, criteria);
		}
	}
	
	@Data
	private static class RepoWorker {
		RepoSchemi repo;
		Map<String, SchemaWorker> schemi = new HashMap<>();
		static RepoWorker wrap(RepoSchemi repo) {
			RepoWorker worker = new RepoWorker();
			worker.setRepo(repo);
			repo.getSchemi().forEach(s -> worker.addSchema(s));
			return worker;
		}
		
		private void addSchema(JsonNode schema) {
			schemi.put(schema.get("id").asText(), SchemaWorker.wrap(this, schema));
		}

		public Specification<Oggetto> toSpecification(SearchRequestFormCriteria criteria) {
			return schemi.get(criteria.schema).toSpecification(criteria);
		}
	
	}
	
}
