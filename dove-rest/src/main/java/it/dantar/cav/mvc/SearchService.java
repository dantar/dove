package it.dantar.cav.mvc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.dantar.cav.entities.Oggetto;
import it.dantar.cav.entities.OggettoDao;
import it.dantar.cav.entities.RepoSchemi;
import it.dantar.cav.entities.RepoSchemiDao;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
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
	
	static Expression<String> jsonbExtractPathText(CriteriaBuilder cb, Expression<Object> json, String... path) {
		List<Expression> ll = new ArrayList();
		ll.add(json);
		ll.addAll(Arrays.asList(path).stream().map(s -> cb.literal(s)).toList());
		Expression[] literals = ll.toArray(new Expression[0]);
		return cb.function("jsonb_extract_path_text", String.class, literals);
	}
	
	static Expression<Object> jsonbExtractPath(CriteriaBuilder cb, Expression<Object> json, String... path) {
		List<Expression> ll = new ArrayList();
		ll.add(json);
		ll.addAll(Arrays.asList(path).stream().map(s -> cb.literal(s)).toList());
		Expression[] literals = ll.toArray(new Expression[0]);
		return cb.function("jsonb_extract_path", Object.class, literals);
	}
	
	static Expression<Boolean> jsonbPathMatch(CriteriaBuilder cb, Expression<Object> json, String jsonpath) {
		return cb.function("jsonb_path_match", Boolean.class, json, cb.literal(jsonpath)) ;
	}
	
	protected static final SpecificationBuilderRegistry<Oggetto> SPECBUILDER = new SpecificationBuilderRegistry<Oggetto>()
			.registerSpecificationBuilder("text", new SpecificationBuilder<Oggetto>() {
				@Data
				static class SearchRequestFormCriteriaText {
					static final String CONTAINS = "contains";
					static final String EQUALS = "equals";
					String text;
					String operator;
					@JsonProperty("case")
					boolean matchCase;
				}
				@Override
				@SneakyThrows({JsonProcessingException.class, IllegalArgumentException.class})
				public Specification<Oggetto> toSpecification(SchemaWorker worker, SchemaCampoReader campo, SearchRequestFormCriteria criteria) {
					log.info("Search by TEXT {}", criteria);
					ObjectMapper mapper = new ObjectMapper();
					SearchRequestFormCriteriaText c = mapper.treeToValue(criteria.getCriteria(), SearchRequestFormCriteriaText.class);
					return (oggetto, query, cb) -> {
						Expression<String> dbValue = jsonbExtractPathText(cb, oggetto.get(SCHEDA), VALUES, campo.getId());
						String searchedText = criteria.getCriteria().path("text").asText();
						if (!c.isMatchCase()) {
							dbValue = cb.lower(dbValue);
							searchedText = searchedText.toLowerCase();
						}
						switch (c.getOperator()) {
						case SearchRequestFormCriteriaText.CONTAINS: {
							return cb.like(dbValue, "%" + searchedText + "%");
						}
						case SearchRequestFormCriteriaText.EQUALS: {
							return cb.equal(dbValue, searchedText);
						}
						default:
							throw new IllegalArgumentException("Unexpected value: " + c.getOperator());
						}
					};
				}
			})
			.registerSpecificationBuilder("chips", new SpecificationBuilder<Oggetto>() {
				@Data
				static class SearchRequestFormCriteriaChips {
					List<String> options;
					String operator;
				}
				@Override
				@SneakyThrows({JsonProcessingException.class, IllegalArgumentException.class})
				public Specification<Oggetto> toSpecification(SchemaWorker worker, SchemaCampoReader campo, SearchRequestFormCriteria criteria) {
					log.info("Search by CHIPS {}", criteria);
					ObjectMapper mapper = new ObjectMapper();
					SearchRequestFormCriteriaChips c = mapper.treeToValue(criteria.getCriteria(), SearchRequestFormCriteriaChips.class);
					String a = String.join(" || ", 
							c.getOptions()
							.stream()
							.map(token -> String.format("@ == \"%s\"", token))
							.toList()
							);
					return (oggetto, query, cb) -> cb.isTrue(
							jsonbPathMatch(cb, oggetto.get(SCHEDA), String.format("exists($.values.%s[*] ? (%s))", criteria.getCampo(), a))
							);
					}
			})
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
		Integer pageIndex = 0;
		Integer pageSize = 10;
		public PageRequest getPageRequest() {
			return PageRequest.of(pageIndex, pageSize);
		}
	}

	public Page<Oggetto> search(SearchRequestForm search) {		
		RepoWorker worker = repoSchemiDao
				.findById(search.getRepo())
				.map(repo -> RepoWorker.wrap(repo))
				.orElseThrow(IllegalArgumentException::new);
		List<Specification<Oggetto>> specifications = search.query.stream().map(criteria -> worker.toSpecification(criteria)).toList();
		return oggettoDao.findAll(andAllCriteria(specifications), search.getPageRequest());
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
			return Optional
					.ofNullable(SPECBUILDER.getSpecificationBuilder(campo.getTipo()))
					.map(sb -> sb.toSpecification(this, campo, criteria))
					.orElseThrow(() -> new IllegalArgumentException(String.format("Tipo campo %s has no Specification Builder", campo.getTipo())));
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
