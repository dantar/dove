package it.dantar.cav.configuration;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfiguration {
	
	public static final String PROPERTY_CACHE_NAME = "propertyCache";

}
