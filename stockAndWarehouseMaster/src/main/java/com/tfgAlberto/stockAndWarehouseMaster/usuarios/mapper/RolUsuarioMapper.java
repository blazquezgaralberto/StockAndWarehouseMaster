package com.tfgAlberto.stockAndWarehouseMaster.usuarios.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.ERole;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.RolUsuario;

@Mapper
public interface RolUsuarioMapper {
	Optional<RolUsuario> findByName(@Param("name") ERole name);
	List<RolUsuario> findRolesByUserId(@Param("id") Long userId);
	List<RolUsuario> findRoles();

	void deleteRolesUsuario(@Param("userId") long userId);
	void addUserRole(@Param("id") long id,@Param("idRole") long idRole);
}
