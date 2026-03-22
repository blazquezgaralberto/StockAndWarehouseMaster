package com.tfgAlberto.stockAndWarehouseMaster.usuarios.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgAlberto.stockAndWarehouseMaster.usuarios.mapper.RolUsuarioMapper;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.ERole;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.RolUsuario;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.service.RolUsuarioService;

@Service
public class RolUsuarioServiceImpl implements RolUsuarioService {
    private final RolUsuarioMapper rolUsuarioMapper;

    @Autowired
    public RolUsuarioServiceImpl(RolUsuarioMapper rolUsuarioMapper) {
        this.rolUsuarioMapper = rolUsuarioMapper;
    }

    @Override
    public Optional<RolUsuario> findRoleByName(ERole name) {
        return rolUsuarioMapper.findByName(name);
    }
    
    @Override
	public List<RolUsuario> findRolesByUserId(Long userId) {
		return rolUsuarioMapper.findRolesByUserId(userId);
	}
    
	@Override
	public List<RolUsuario> findRoles() {
		return rolUsuarioMapper.findRoles();
	}

	@Override
	public void deleteRolesUsuario(long userId) {
		rolUsuarioMapper.deleteRolesUsuario(userId);
	}

	@Override
	public void addUserRole(long id, long roleId) {
		rolUsuarioMapper.addUserRole(id, roleId);
	}
}