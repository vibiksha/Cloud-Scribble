package com.programming.techie.springngblog.security;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;

@Service
public class JwtProvider {

    String jwksUrl = "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_RoZXYjc5I/.well-known/jwks.json";


    public boolean validateCognitoToken(String jwtToken) {
        try {
            JWKSet jwkSet = JWKSet.load(new URL(jwksUrl));
            SignedJWT signedJWT = SignedJWT.parse(jwtToken);

            JWSHeader header = signedJWT.getHeader();
            RSAKey rsaKey = (RSAKey) jwkSet.getKeyByKeyId(header.getKeyID());

            RSAPublicKey publicKey = rsaKey.toRSAPublicKey();
            JWSVerifier verifier = new RSASSAVerifier(publicKey);
            return signedJWT.verify(verifier);
        } catch (JOSEException | java.text.ParseException e) {
            // Token validation failed
            return false;
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String extractUsernameFromCognitoToken(String jwtToken) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(jwtToken);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            return claimsSet.getSubject();
        } catch (ParseException e) {
            // Error while extracting username
            return null;
        }
    }
}
