package it.dantar.cav.security.jwt;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import it.dantar.cav.security.AppUserDetails;
import it.dantar.cav.security.AppUserDetailsService;
import it.dantar.cav.security.authentication.mfa.CustomAuthenticationToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

	private final AppUserDetailsService userDetailsService;
	private final JwtTokenService jwtTokenService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
		if (SecurityContextHolder.getContext().getAuthentication() == null) {			
			String jwtToken = jwtTokenService.getJwtToken(request);
			Optional<Claims> jwtClaims = Optional.ofNullable(jwtToken)
					.map(token -> jwtTokenService.parseJwtToken(jwtToken))
					.orElse(Optional.empty());
			if (jwtClaims.isPresent()) {
				Claims claims = jwtClaims.get();
				AppUserDetails userDetails = Optional.ofNullable(claims.getSubject())
						.map(userDetailsService::loadUserByUsername)
						.orElse(null);
				if (userDetails != null) {
					SecurityContextHolder
					.getContext()
					.setAuthentication(
							new CustomAuthenticationToken(userDetails, null, null,userDetails.getAuthorities())
							);
				} else {
					log.warn("User {} does not exist", claims.getSubject());
				}
			}
		}
		chain.doFilter(request, response);
	}

}