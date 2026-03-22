package com.tfgAlberto.stockAndWarehouseMaster.usuarios.service;

import java.util.List;
import java.util.Optional;

import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.ERole;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.RolUsuario;

public interface RolUsuarioService {
	Optional<RolUsuario> findRoleByName(ERole name);
	List<RolUsuario> findRolesByUserId(Long userId);
	List<RolUsuario> findRoles();
	
	void deleteRolesUsuario(long userId);
	void addUserRole(long id, long roleId);
}
