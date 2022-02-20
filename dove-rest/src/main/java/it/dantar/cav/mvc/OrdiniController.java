package it.dantar.cav.mvc;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.dantar.cav.entities.Cliente;
import it.dantar.cav.entities.ClienteDao;
import it.dantar.cav.entities.OggettoOrdine;
import it.dantar.cav.entities.OggettoOrdineDao;
import it.dantar.cav.entities.Ordine;
import it.dantar.cav.entities.OrdineDao;
import it.dantar.cav.mvc.OrdineBrowseDto.OggettoInOrdineDto;
import it.dantar.cav.security.AppUserDetails;

@RestController
public class OrdiniController {

	@Autowired
	private OrdineDao ordineDao;
	@Autowired
	private ClienteDao clienteDao;
	@Autowired
	private OggettoOrdineDao oggettoOrdineDao;
	@Autowired
	private ObjectMapper mapper; 

	@GetMapping("/orders")
	public List<OrdineBrowseDto> browseOrders() {
		List<Object[]> rows = ordineDao.findByUtente(AppUserDetails.loggedUser().getUtente().getId());
		return rows.stream()
				.map(row -> OrdineBrowseDto.rowNew(row))
				.map(ordine -> ordine.setOggetti(oggettoOrdineDao.findOggettiByOrdine(ordine.getOrdine().getId())
						.stream()
						.map(row -> new OggettoInOrdineDto(row))
						.collect(Collectors.toList())
						))
				.collect(Collectors.toList())
				;
	}

	@PostMapping("/orders/{idOrdine}/{idOggetto}")
	public List<OggettoInOrdineDto> addOggettoToOrdine(@PathVariable String idOrdine, @PathVariable String idOggetto) {
		OggettoOrdine oggettoInOrdine = new OggettoOrdine(idOggetto, idOrdine);
		oggettoOrdineDao.save(oggettoInOrdine);
		return oggettoOrdineDao.findOggettiByOrdine(idOrdine)
				.stream()
				.map(row -> new OggettoInOrdineDto(row))
				.collect(Collectors.toList())
				;
	}

	@PostMapping("/orders/new/{idCliente}")
	public OrdineBrowseDto newOrder(@PathVariable String idCliente) {
		Cliente cliente = clienteDao.findById(idCliente).orElseThrow(IllegalArgumentException::new);
		Ordine ordine = new Ordine(UUID.randomUUID().toString(), idCliente, mapper.createObjectNode(), "nuovo");
		ordineDao.save(ordine);
		return new OrdineBrowseDto(ordine, cliente, new ArrayList<>());
	}

}
