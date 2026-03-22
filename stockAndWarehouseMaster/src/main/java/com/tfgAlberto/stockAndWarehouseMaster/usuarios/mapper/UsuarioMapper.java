package com.tfgAlberto.stockAndWarehouseMaster.usuarios.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;

@Mapper
public interface UsuarioMapper {

	Optional<Usuario> findByUsername(String username);
	Boolean existsByUsername(String username);
	Boolean existsByEmail(String email);
	void delete(Usuario usuario);
	void update(Usuario usuario);
	void updateWithPhoto(Usuario usuario);
    void insertUserRole(@Param("roleId") Integer roleId);
	void save(Usuario user);
	
	List<Usuario> findUsuariosTipo(@Param("roleId") long roleId);
	List<Usuario> findAll();
	Usuario findDetailsByUsername(String username);
	Usuario findDetailsById(Long idUsuario);
}
