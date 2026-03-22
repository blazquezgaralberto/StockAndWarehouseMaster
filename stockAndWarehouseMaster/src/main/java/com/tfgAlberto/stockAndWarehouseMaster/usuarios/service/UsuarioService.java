package com.tfgAlberto.stockAndWarehouseMaster.usuarios.service;

import java.util.List;
import java.util.Optional;

import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;

public interface UsuarioService {

	Optional<Usuario> findByUsername(String username);
	Boolean existsByUsername(String username);
	Boolean existsByEmail(String email);
	void deleteUSuario(Usuario producto);
	void updateUser(Usuario user);
	
	List<Usuario> findUsuariosTipo(long id);
	List<Usuario> findAll();
	Usuario findDetailsByUsername(String username);
}
