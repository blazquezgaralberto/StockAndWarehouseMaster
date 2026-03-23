package com.tfgAlberto.stockAndWarehouseMaster.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.tfgAlberto.stockAndWarehouseMaster.security.jwt.AuthEntryPointJwt;
import com.tfgAlberto.stockAndWarehouseMaster.security.jwt.AuthTokenFilter;
import com.tfgAlberto.stockAndWarehouseMaster.security.services.UserDetailsServiceImpl;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity   // Permite usar @PreAuthorize en los controllers
public class WebSecurityConfig {

  @Autowired
  UserDetailsServiceImpl userDetailsService;

  @Autowired
  private AuthEntryPointJwt unauthorizedHandler;

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    // BCrypt con factor de coste 12 (por defecto es 10).
    // Factor más alto = más tiempo para verificar = más resistencia a fuerza bruta.
    // En un servidor moderno, factor 12 tarda ~250ms, aceptable para login.
    return new BCryptPasswordEncoder(12);
  }

  // ==========================================================================
  // SECURITY FIX: Configuración explícita de CORS
  //
  // ANTES: Sin configuración → comportamiento indefinido según entorno.
  // AHORA: Orígenes permitidos explícitos. En producción, cambiar
  //        allowedOrigins por la URL real del frontend.
  // ==========================================================================
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // PRODUCCIÓN: Cambiar por la URL real del frontend, nunca "*"
    // Ejemplo: configuration.setAllowedOrigins(List.of("https://app.tudominio.com"));
    configuration.setAllowedOrigins(List.of(
        "http://localhost:4200"  // Angular dev server
    ));

    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));

    // Permite que el frontend lea la cabecera Authorization de la respuesta
    configuration.setExposedHeaders(List.of("Authorization"));

    // Permite cookies/credenciales en peticiones CORS (necesario si usas cookies)
    configuration.setAllowCredentials(true);

    // Tiempo que el navegador cachea la respuesta pre-flight (OPTIONS)
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        // ======================================================================
        // CSRF
        // Justificación para desactivar: Esta es una API REST stateless que usa
        // JWT en cabecera Authorization (no en cookies). Los tokens JWT no se
        // envían automáticamente por el navegador, por lo que CSRF no aplica.
        // IMPORTANTE: Si en algún momento se cambia a cookies para JWT,
        // CSRF debe reactivarse inmediatamente.
        // ======================================================================
        .csrf(csrf -> csrf.disable())

        // CORS explícito usando el bean definido arriba
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))

        // Manejador de errores 401 (no autenticado)
        .exceptionHandling(exception -> exception
            .authenticationEntryPoint(unauthorizedHandler))

        // Stateless: sin sesiones HTTP. Cada petición debe llevar su JWT.
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // ======================================================================
        // SECURITY FIX: Reglas de autorización corregidas
        //
        // ANTES: auth.requestMatchers("/**").permitAll() → TODO público
        //        La regla /** coincide con cualquier URL y se evalúa primero,
        //        haciendo que .anyRequest().authenticated() nunca se alcance.
        //        Resultado: API completamente pública sin autenticación.
        //
        // AHORA: Solo los endpoints de autenticación son públicos.
        //        Todo lo demás requiere JWT válido.
        //        OWASP: A01 Broken Access Control
        // ======================================================================
        .authorizeHttpRequests(auth -> auth
            // Endpoints públicos: solo login y registro
            .requestMatchers("/api/auth/**").permitAll()

            // Swagger/OpenAPI si lo usas (solo en dev, quitar en producción)
            // .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

            // Actuator health check (sin detalles sensibles)
            .requestMatchers("/actuator/health").permitAll()

            // TODO lo demás requiere autenticación
            .anyRequest().authenticated()
        )

        // ======================================================================
        // Security Headers
        // Añade cabeceras HTTP de seguridad en todas las respuestas.
        // Protege contra clickjacking, XSS, y sniffing de contenido.
        // ======================================================================
        .headers(headers -> headers
            // Evita que la app se cargue en un iframe (anti-clickjacking)
            .frameOptions(frame -> frame.deny())
            // Evita que el navegador "adivine" el tipo de contenido
            .contentTypeOptions(contentType -> {})
            // Política de referrer: no enviar URL completa al hacer click en enlaces
            .referrerPolicy(referrer -> referrer
                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            // Content Security Policy: qué recursos puede cargar el navegador
            // Ajustar según las necesidades reales del frontend
            .contentSecurityPolicy(csp -> csp
                .policyDirectives("default-src 'self'; frame-ancestors 'none'"))
        );

    http.authenticationProvider(authenticationProvider());
    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
