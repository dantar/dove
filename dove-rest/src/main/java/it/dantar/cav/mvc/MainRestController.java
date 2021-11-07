package it.dantar.cav.mvc;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class MainRestController {

	@Autowired
	private Environment environment;
	
	@GetMapping("/app/alive")
	public Boolean alive() {
		return true;
	}

	@GetMapping("/app/config")
	public Map<String, String> appConfig() {
		Map<String, String> result = new HashMap<String, String>();
		result.put("spring.profiles.active", String.join(",", environment.getActiveProfiles()));
		return result ;
	}
	
}
