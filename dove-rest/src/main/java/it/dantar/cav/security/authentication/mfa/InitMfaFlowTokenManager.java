package it.dantar.cav.security.authentication.mfa;

import java.io.Serializable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrDataFactory;
import dev.samstevens.totp.secret.SecretGenerator;

@Service
public class InitMfaFlowTokenManager implements Serializable {

	public static final String JWT_MFA_INIT_FLOW_TOKEN_AUTHORITY = "MFA_inizialization";

	public static final String MFA_INIT_FLOW_QR_URI_ISSUER = "BNP Paribas StimaRE";

	public static final String MFA_INIT_FLOW_QR_URI_LABEL = "Login";

	private static final long serialVersionUID = 2321284138440612035L;

	@Autowired
	private SecretGenerator secretGenerator;

	@Autowired
	private CodeVerifier codeVerifier;

	@Autowired
	private QrDataFactory qrDataFactory;

	public String generateSecretKey() {
		return secretGenerator.generate();
	}

	public String getQRUri(String secret) {
		QrData data = qrDataFactory.newBuilder()
				.label(MFA_INIT_FLOW_QR_URI_LABEL)
				.secret(secret)
				.issuer(MFA_INIT_FLOW_QR_URI_ISSUER)
				.algorithm(HashingAlgorithm.SHA1).build();
		return data.getUri();
	}

	public boolean verifyTotp(String code, String secret) {
		return codeVerifier.isValidCode(secret, code);
	}
}