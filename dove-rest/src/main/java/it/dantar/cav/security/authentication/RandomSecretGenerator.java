package it.dantar.cav.security.authentication;

import java.security.SecureRandom;
import org.apache.commons.codec.binary.Base32;
import org.springframework.stereotype.Service;
import dev.samstevens.totp.secret.SecretGenerator;

@Service
public class RandomSecretGenerator implements SecretGenerator {

    private static final int SECRET_LENGTH = 32;

	// Method to generate random Base32 encoded string
    public static String generateRandomBase32Secret(int length) {
        // Create a SecureRandom instance
        SecureRandom secureRandom = new SecureRandom();
        
        // Generate random bytes
        byte[] randomBytes = new byte[length];
        secureRandom.nextBytes(randomBytes);

        // Create a Base32 encoder
        Base32 base32 = new Base32();

        // Encode random bytes into Base32 and return as a string
        return base32.encodeToString(randomBytes).toUpperCase();
    }

	@Override
	public String generate() {
		return generateRandomBase32Secret(SECRET_LENGTH);
	}

}
