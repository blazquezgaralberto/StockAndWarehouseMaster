package com.tfgAlberto.stockAndWarehouseMaster.usuarios.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Usuario{

	private Long id;
	private String nombre;
	private String username;
	@JsonIgnore
	private String contrasena;
	private String email;
	private String telefono;
	private Date fechaAlta;
	private Set<RolUsuario> roles = new HashSet<RolUsuario>();
	private byte[] photo;

	private String ubicacion;
	
	public Usuario(String nombre, String username, String email, String contrasena) {
		this.nombre = nombre;
		this.username = username;
	    this.email = email;
	    this.contrasena = contrasena;
	}

}
