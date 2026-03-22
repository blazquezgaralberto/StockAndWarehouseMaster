package com.tfgAlberto.stockAndWarehouseMaster.usuarios.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tfgAlberto.stockAndWarehouseMaster.almacen.service.AlmacenService;
import com.tfgAlberto.stockAndWarehouseMaster.payload.response.MessageResponse;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.RolUsuario;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.service.RolUsuarioService;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.service.UsuarioService;

@RestController()
@RequestMapping("/api/users")
public class UserController {

	@Autowired
    private UsuarioService userService;
	
	@Autowired
    private RolUsuarioService rolUsuarioService;
	
	@Autowired
	private AlmacenService almacenService;
	
	@Autowired
    public UserController(UsuarioService userService,RolUsuarioService rolUsuarioService) {
        this.userService = userService;
        this.rolUsuarioService = rolUsuarioService;
    }

	@GetMapping("/listaUsuariosTipo/{id}")
	public ResponseEntity<List<Usuario>> getUsuariosTipo(@PathVariable("id") Integer id) {
		List<Usuario> listaUsuarios = userService.findUsuariosTipo(id);
		return new ResponseEntity<List<Usuario>>(listaUsuarios, HttpStatus.OK);
    }

	@GetMapping("/listaUsuarios")
	public ResponseEntity<List<Usuario>> getAllUsuarios() {
		List<Usuario> listaUsuarios = userService.findAll();
		return new ResponseEntity<List<Usuario>>(listaUsuarios, HttpStatus.OK);
    }

	@GetMapping("/userByUsername/{username}")
	public ResponseEntity<Usuario> userByusername(@PathVariable("username") String username) {
		Usuario usuario = userService.findDetailsByUsername(username);
		return new ResponseEntity<Usuario>(usuario, HttpStatus.OK);
    }
	
	@GetMapping("/getComboRoles")
	public ResponseEntity<List<RolUsuario>> getComboRoles() {
		List<RolUsuario> listaRoles = rolUsuarioService.findRoles();
		return new ResponseEntity<List<RolUsuario>>(listaRoles, HttpStatus.OK);
    }

	@PostMapping("/changeRoles")
    public ResponseEntity<?> changeRoles(@RequestBody Usuario usuario) {
		if(null != usuario && !usuario.getRoles().isEmpty()){
			//si se borra el rol almacen y existe->desactivar
			rolUsuarioService.deleteRolesUsuario(usuario.getId());
			
			usuario.getRoles().forEach(rol->{
				rolUsuarioService.addUserRole(usuario.getId(), rol.getId());
			});
			
			if(null != usuario.getUbicacion()) {
				almacenService.createAlmacenByUser(usuario);
			}
		}
		return new ResponseEntity(HttpStatus.OK);
    }

	@PostMapping("/deleteUsuario")
    public ResponseEntity<?> deleteUsuario(@RequestBody Usuario usuario) {
		if(null != usuario) {
			rolUsuarioService.deleteRolesUsuario(usuario.getId());
			userService.deleteUSuario(usuario);
			for(RolUsuario rol: usuario.getRoles()) {
				if(rol.getId()== 4) {
					almacenService.deleteAlmacenByIdUsuario(usuario.getId());
				}
			}
			return new ResponseEntity<>(new MessageResponse("Usuario borrado correctamente"), HttpStatus.OK);
		}
		return new ResponseEntity<>(new MessageResponse("Hubo algún problema"), HttpStatus.BAD_REQUEST);
    }

	@PostMapping("/update")
    public ResponseEntity<?> updateUsuario(@RequestBody Usuario usuario) {
		if(null != usuario) {
			usuario.setPhoto(null);
			userService.updateUser(usuario);
    		return new ResponseEntity<>(new MessageResponse("Usaurio actualizado correctamente"), HttpStatus.OK);
		}
		return new ResponseEntity<>(new MessageResponse("Hubo algún problema, consulte con el administrador"), HttpStatus.BAD_REQUEST);
    }

	@PostMapping(value = "/updateUserPhoto")
	public ResponseEntity<?> updateUserPhoto(@ModelAttribute Usuario user, @RequestParam("imagen") MultipartFile imagen) throws IOException {
		if(null != user && null != imagen) {
			user.setPhoto(imagen.getBytes());
			userService.updateUser(user);
    		return new ResponseEntity<>(new MessageResponse("Usaurio actualizado correctamente"), HttpStatus.OK);
		}
		return new ResponseEntity<>(new MessageResponse("Hubo algún problema, consulte con el administrador"), HttpStatus.BAD_REQUEST);
	}
	
}
