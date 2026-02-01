package it.dantar.cav.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.qr.QrDataFactory;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;

@Configuration
public class AuthenticationConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(10);
	}

	@Bean
	QrDataFactory qrDataFactory() {
		return new QrDataFactory(HashingAlgorithm.SHA1, 6, 30);
	}

	@Bean
	CodeGenerator codeGenerator() {
		return new DefaultCodeGenerator(HashingAlgorithm.SHA1, 32);
	}

	@Bean
	TimeProvider timeProvider() {
		return new SystemTimeProvider();
	}

	@Bean
	CodeVerifier codeVerifier() throws Exception {
		DefaultCodeVerifier verifier = new DefaultCodeVerifier(codeGenerator(), timeProvider());
		// verifier.setTimePeriod(CODE_VALIDITY_IN_SECONDS);
		// verifier.setAllowedTimePeriodDiscrepancy(TIME_PERIOD_DISCREPANCY);
		return verifier;
	}

}
