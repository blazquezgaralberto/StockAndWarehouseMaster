package com.tfgAlberto.stockAndWarehouseMaster.usuarios.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgAlberto.stockAndWarehouseMaster.usuarios.mapper.RolUsuarioMapper;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.mapper.UsuarioMapper;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.service.UsuarioService;

@Service
public class UsuarioServiceImpl implements UsuarioService{

	private final UsuarioMapper usuarioMapper;
	private final RolUsuarioMapper roUsuarioMapper;
	
	@Autowired
    public UsuarioServiceImpl(UsuarioMapper usuarioMapper, RolUsuarioMapper roUsuarioMapper) {
        this.usuarioMapper = usuarioMapper;
        this.roUsuarioMapper = roUsuarioMapper;
    }

    @Override
    public Optional<Usuario> findByUsername(String username) {
        return usuarioMapper.findByUsername(username);
    }

    @Override
    public Boolean existsByUsername(String username) {
        return usuarioMapper.existsByUsername(username);
    }

    @Override
    public Boolean existsByEmail(String email) {
        return usuarioMapper.existsByEmail(email);
    }
    
    public void save(Usuario usuario) {
    	usuarioMapper.save(usuario);
    }

	@Override
	public List<Usuario> findUsuariosTipo(long id) {
		return usuarioMapper.findUsuariosTipo(id);
	}

	@Override
	public List<Usuario> findAll() {
		return usuarioMapper.findAll();
	}

	@Override
    public Usuario findDetailsByUsername(String username) {
		Usuario user = usuarioMapper.findDetailsByUsername(username);
		user.setRoles(new HashSet<>(roUsuarioMapper.findRolesByUserId(user.getId())));
        return user;
    }

	@Override
	public void deleteUSuario(Usuario usuario) {
		usuarioMapper.delete(usuario);
	}

	@Override
	public void updateUser(Usuario user) {
		if(null != user.getPhoto()) {
			usuarioMapper.updateWithPhoto(user);
		}else {
			usuarioMapper.update(user);
		}
	}
}
