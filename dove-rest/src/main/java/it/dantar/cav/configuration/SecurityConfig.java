package it.dantar.cav.configuration;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import it.dantar.cav.security.authentication.mfa.CustomAuthenticationProvider;
import it.dantar.cav.security.authentication.mfa.InitMfaFlowValidationProvider;
import it.dantar.cav.security.jwt.JwtAuthenticationEntryPoint;
import it.dantar.cav.security.jwt.JwtRequestFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	@Autowired
	private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

	@Autowired
	private UserDetailsService jwtUserDetailsService;

	@Autowired
	private JwtRequestFilter jwtRequestFilter;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Value("${deps.cors.allowedorigins}")
	private String corsAllowedOrigins;

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfiguration) throws Exception {
		return authConfiguration.getAuthenticationManager();
	}

	@Bean
	SecurityFilterChain filterChainControlPanel(HttpSecurity http) throws Exception {
		http
				.csrf(c -> c.disable())
				.cors(c -> c.configurationSource(corsConfigurationSource()))
				.authorizeHttpRequests(c -> c
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/authenticate").permitAll()
						.requestMatchers(HttpMethod.POST, "/utenti/resetpassword/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/utenti/resetpassword/**").permitAll()
						.anyRequest().authenticated())
				.exceptionHandling(c -> c.authenticationEntryPoint(jwtAuthenticationEntryPoint))
				.sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(authProvider())
				.authenticationProvider(otpValidationProvider())
				.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	WebSecurityCustomizer webSecurityCustomizerAPI() {
		return web -> web.ignoring().requestMatchers(
				"/v2/api-docs", "/configuration/ui", "/swagger-resources/**", "/configuration/security",
				"/swagger-ui.html", "/webjars/**");
	}

	private CorsConfigurationSource corsConfigurationSource() {
		// https://stackoverflow.com/questions/53605255/spring-boot-jwt-cors-with-angular-6

		List<String> allowedOrigins = Arrays.stream(corsAllowedOrigins.split(","))
				.map(String::trim)
				.toList();

		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(allowedOrigins);
		configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "OPTIONS", "PUT", "DELETE"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	private DaoAuthenticationProvider authProvider() {
		final CustomAuthenticationProvider authProvider = new CustomAuthenticationProvider();
		authProvider.setUserDetailsService(jwtUserDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder);
		return authProvider;
	}

	private DaoAuthenticationProvider otpValidationProvider() {
		final InitMfaFlowValidationProvider otpValidationProvider = new InitMfaFlowValidationProvider();
		otpValidationProvider.setUserDetailsService(jwtUserDetailsService);
		otpValidationProvider.setPasswordEncoder(passwordEncoder);
		return otpValidationProvider;
	}

}