package com.tfgAlberto.stockAndWarehouseMaster.authentication.service.impl;

import java.io.UnsupportedEncodingException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tfgAlberto.stockAndWarehouseMaster.authentication.service.AuthService;
import com.tfgAlberto.stockAndWarehouseMaster.correoService.impl.MailServiceImpl;
import com.tfgAlberto.stockAndWarehouseMaster.payload.request.LoginRequest;
import com.tfgAlberto.stockAndWarehouseMaster.payload.request.SignupRequest;
import com.tfgAlberto.stockAndWarehouseMaster.payload.response.JwtResponse;
import com.tfgAlberto.stockAndWarehouseMaster.payload.response.MessageResponse;
import com.tfgAlberto.stockAndWarehouseMaster.security.jwt.JwtUtils;
import com.tfgAlberto.stockAndWarehouseMaster.security.services.UserDetailsImpl;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.mapper.RolUsuarioMapper;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.mapper.UsuarioMapper;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.ERole;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.RolUsuario;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@Service
public class AuthServiceImpl implements AuthService{

	@Autowired
    private AuthenticationManager authenticationManager;
	
	@Autowired
    private UsuarioMapper usuarioMapper;
	
	@Autowired
    private RolUsuarioMapper rolUsuarioMapper;
	
	@Autowired
    private PasswordEncoder encoder;
	@Autowired
    private JwtUtils jwtUtils;
	
	@Autowired
	private MailServiceImpl mailSender;
	
	
	@Override
	public ResponseEntity<?> login(@Valid LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
			
			SecurityContextHolder.getContext().setAuthentication(authentication);
			String jwt = jwtUtils.generateJwtToken(authentication);

			UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
			List<String> roles = authentication.getAuthorities().stream().map(item -> item.getAuthority())
				.collect(Collectors.toList());

			return ResponseEntity.ok(
				new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles));
	}

	@Override
	public ResponseEntity<?> signup(@Valid SignupRequest signUpRequest) {
			if (usuarioMapper.existsByUsername(signUpRequest.getUsername())) {
		      return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
		    }

		    if (usuarioMapper.existsByEmail(signUpRequest.getEmail())) {
		      return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
		    }

		    //New user
		    Usuario user = new Usuario(signUpRequest.getName(), signUpRequest.getUsername(),
		    		signUpRequest.getEmail(),encoder.encode(signUpRequest.getPassword()));

		    Set<String> strRoles = signUpRequest.getRoles();
		    Set<RolUsuario> roles = new HashSet<>();

		    if (strRoles == null) {
		    	RolUsuario userRole = rolUsuarioMapper.findByName(ERole.ROLE_USER)
		          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
		      roles.add(userRole);
		    } else {
		      strRoles.forEach(role -> {
		        switch (role) {
		        case "user":
		        	RolUsuario userLogedRole = rolUsuarioMapper.findByName(ERole.ROLE_USER)
		              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
		          roles.add(userLogedRole);

		          break;
		        case "admin":
		        	RolUsuario adminRole = rolUsuarioMapper.findByName(ERole.ROLE_ADMIN)
		              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
		          roles.add(adminRole);

		          break;
		        case "almacen":
		        	RolUsuario modRole = rolUsuarioMapper.findByName(ERole.ROLE_ALMACEN)
		              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
		          roles.add(modRole);

		          break;
		        case "fabricante":
		        	RolUsuario fabRole = rolUsuarioMapper.findByName(ERole.ROLE_FABRICANTE)
		              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
		          roles.add(fabRole);

		          break;
		        default:
		        	RolUsuario userRole = rolUsuarioMapper.findByName(ERole.ROLE_USER)
		              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
		          roles.add(userRole);
		        }
		      });
		    }

		    user.setRoles(roles);
		    usuarioMapper.save(user);
		    roles.forEach(rol -> {
		    	usuarioMapper.insertUserRole(rol.getId());
		    });
		    


			try {
				mailSender.correoConfirmacionCuenta(user);
			} catch (UnsupportedEncodingException | MessagingException e) {
				e.printStackTrace();
			}



		    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}

}
