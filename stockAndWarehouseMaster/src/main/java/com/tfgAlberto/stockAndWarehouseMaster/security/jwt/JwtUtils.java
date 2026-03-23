package com.tfgAlberto.stockAndWarehouseMaster.security.jwt;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.tfgAlberto.stockAndWarehouseMaster.security.services.UserDetailsImpl;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;

// =============================================================================
// MIGRATION NOTE: jjwt 0.11.x → 0.12.x
//
// Cambios de API aplicados:
//   - parserBuilder()          → parser()
//   - parseClaimsJws()         → parseSignedClaims()
//   - .getBody()               → .getPayload()
//   - setSubject/setIssuedAt   → claim()/subject()/issuedAt() (builder fluent)
//   - SignatureAlgorithm enum  → eliminado, se usa directamente en signWith()
//   - Key                      → SecretKey (más específico y seguro)
// =============================================================================

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${stockAndWarehouseMaster.app.jwtSecret}")
  private String jwtSecret;

  @Value("${stockAndWarehouseMaster.app.jwtExpirationMs}")
  private int jwtExpirationMs;

  public String generateJwtToken(Authentication authentication) {
    UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

    return Jwts.builder()
        // MIGRATION: setSubject() → subject()
        .subject(userPrincipal.getUsername())
        // MIGRATION: setIssuedAt() → issuedAt()
        .issuedAt(new Date())
        // MIGRATION: setExpiration() → expiration()
        .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
        // MIGRATION: signWith(key, algorithm) → signWith(key)
        // El algoritmo se infiere automáticamente del tipo de clave (HMAC-SHA)
        .signWith(key())
        .compact();
  }

  // MIGRATION: Key → SecretKey (subtipo más específico, requerido por 0.12.x)
  private SecretKey key() {
    return Keys.hmacShaKeyFor(jwtSecret.getBytes());
  }

  public String getUserNameFromJwtToken(String token) {
    return Jwts.parser()
        // MIGRATION: parserBuilder().setSigningKey() → parser().verifyWith()
        .verifyWith(key())
        .build()
        // MIGRATION: parseClaimsJws() → parseSignedClaims()
        .parseSignedClaims(token)
        // MIGRATION: .getBody().getSubject() → .getPayload().getSubject()
        .getPayload()
        .getSubject();
  }

  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parser()
          .verifyWith(key())
          .build()
          // MIGRATION: parse() → parseSignedClaims()
          // parse() en 0.12.x no verifica la firma, hay que usar parseSignedClaims()
          .parseSignedClaims(authToken);
      return true;
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT claims string is empty: {}", e.getMessage());
    }
    return false;
  }

  public static String generateSecretKey() {
    byte[] keyBytes = new byte[32];
    new SecureRandom().nextBytes(keyBytes);
    return Base64.getEncoder().encodeToString(keyBytes);
  }
}