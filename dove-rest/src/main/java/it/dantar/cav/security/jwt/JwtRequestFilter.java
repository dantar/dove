package it.dantar.cav.security.jwt;

import java.io.IOException;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import it.dantar.cav.security.AppUserDetails;
import it.dantar.cav.security.AppUserDetailsService;
import it.dantar.cav.security.authentication.mfa.CustomAuthenticationToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

	private static final String REGEXP_VALIDATION_URI_PATTERN = "/authenticate/[^/]+/validateotp";

	@Autowired
	private AppUserDetailsService userDetailsService;
	@Autowired
	private JwtTokenService jwtTokenService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {

		String username = null;
		String jwtToken = jwtTokenService.getJwtToken(request);

		if (!Objects.isNull(jwtToken)) {

			Pattern pattern = Pattern.compile(REGEXP_VALIDATION_URI_PATTERN);
			Matcher uriMatcher = pattern.matcher(request.getRequestURI());

			if (jwtTokenService.isInitMfaFlowToken(jwtToken)) {
				log.debug("getRequestURI: {}", request.getRequestURI());
				if (uriMatcher.find()) {
					Authentication otpValidationToken = jwtTokenService.getInitMfaFlowToken(jwtToken);
					AppUserDetails loadedUser = userDetailsService.loadUserByUsername((String) otpValidationToken.getPrincipal());

					if (loadedUser.isMfaEnalbed() && Objects.isNull(loadedUser.getMfaSecret())) {
						SecurityContextHolder.getContext().setAuthentication(otpValidationToken);
					}
				}
			} else {
				try {
					username = jwtTokenService.getUsernameFromToken(jwtToken);
					if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
						UserDetails userDetails = userDetailsService.loadUserByUsername(username);
						if (Boolean.TRUE.equals(jwtTokenService.validateToken(jwtToken, userDetails))) {
							CustomAuthenticationToken customAuthenticationToken = new CustomAuthenticationToken(userDetails, null, null,
									userDetails.getAuthorities());
							SecurityContextHolder.getContext().setAuthentication(customAuthenticationToken);
						}
					}
				} catch (IllegalArgumentException e) {
					logger.debug("Unable to get JWT Token");
				} catch (ExpiredJwtException e) {
					logger.debug("JWT Token has expired");
				}
			}
		} else {
			logger.debug("JWT Token does not begin with Bearer String");
		}
		chain.doFilter(request, response);
	}

}