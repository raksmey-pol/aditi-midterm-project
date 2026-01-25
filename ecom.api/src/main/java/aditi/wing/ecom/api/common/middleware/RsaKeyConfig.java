package aditi.wing.ecom.api.common.middleware;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

@Configuration
public class RsaKeyConfig {

    @Value("${app.security.rsa.private-key-path:classpath:private.pem}")
    private Resource privateKeyResource;

    @Value("${app.security.rsa.public-key-path:classpath:public.pem}")
    private Resource publicKeyResource;

    @Bean
    public PrivateKey privateKey() throws Exception {
        String key = new String(privateKeyResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        return parsePrivateKey(key);
    }

    @Bean
    public PublicKey publicKey() throws Exception {
        String key = new String(publicKeyResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        return parsePublicKey(key);
    }

    private PrivateKey parsePrivateKey(String pem) throws Exception {
        byte[] decoded = decodePem(pem, "PRIVATE");
        return KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(decoded));
    }

    private PublicKey parsePublicKey(String pem) throws Exception {
        byte[] decoded = decodePem(pem, "PUBLIC");
        return KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(decoded));
    }

    private byte[] decodePem(String pem, @SuppressWarnings("unused") String type) {
        String content = pem
                .replaceAll("-----BEGIN (.*)-----", "")
                .replaceAll("-----END (.*)-----", "")
                .replaceAll("\\s+", "");
        return Base64.getDecoder().decode(content);
    }
}