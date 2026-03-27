package it.dantar.cav.configuration;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
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
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final UserDetailsService jwtUserDetailsService;
	private final JwtRequestFilter jwtRequestFilter;
	private final PasswordEncoder passwordEncoder;

	@Value("${app.url}")
	private String appUrl;

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfiguration) throws Exception {
		return authConfiguration.getAuthenticationManager();
	}

	@Bean
	SecurityFilterChain filterChainControlPanel(HttpSecurity http) throws Exception {
		http
		    .logout(logout -> logout
	            .logoutUrl("/logout")
	            .deleteCookies("auth_token")
	            .logoutSuccessHandler((request, response, authentication) -> {
	                response.setStatus(HttpServletResponse.SC_OK);
	            }))
			.csrf(c -> c.disable())
			.cors(Customizer.withDefaults())
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

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration config = new CorsConfiguration();
	    config.setAllowedOrigins(List.of(appUrl));
	    config.setAllowedMethods(List.of("*"));
	    config.setAllowedHeaders(List.of("*"));
	    config.setAllowCredentials(true); // this allows cookies
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", config);
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