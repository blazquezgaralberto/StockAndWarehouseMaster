package com.tfgAlberto.stockAndWarehouseMaster.security.services;

import java.util.HashSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.service.RolUsuarioService;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.service.UsuarioService;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  @Autowired
  UsuarioService usuarioService;
  
  @Autowired
  RolUsuarioService rolUsuarioServicio;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Usuario user = usuarioService.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
    
    user.setRoles(new HashSet<>(rolUsuarioServicio.findRolesByUserId(user.getId())));
    return UserDetailsImpl.build(user);
  }

}