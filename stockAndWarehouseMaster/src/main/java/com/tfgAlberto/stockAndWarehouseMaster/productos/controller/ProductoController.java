package com.tfgAlberto.stockAndWarehouseMaster.productos.controller;

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

import com.tfgAlberto.stockAndWarehouseMaster.payload.response.MessageResponse;
import com.tfgAlberto.stockAndWarehouseMaster.productos.model.Producto;
import com.tfgAlberto.stockAndWarehouseMaster.productos.service.ProductoService;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.service.UsuarioService;

@RestController()
@RequestMapping("/api/producto")
public class ProductoController {

	@Autowired
	private ProductoService productoService;
	
	@Autowired
    private UsuarioService userService;
	
	@Autowired
    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }
	
	@PostMapping(value = "/newProducto")
	public ResponseEntity<?> insertProducto(@ModelAttribute Producto producto, @RequestParam("imagen") MultipartFile imagen) throws IOException {
	    if(null != producto && null != imagen) {
	    	if(null != producto.getId()) {
	    		producto.setPhoto(imagen.getBytes());
	    		productoService.updateConFoto(producto);
	    		return new ResponseEntity<>(new MessageResponse("Producto actualizado correctamente"), HttpStatus.OK);
	    	}else {
	    		producto.setPhoto(imagen.getBytes());
		        productoService.insertProducto(producto);
		        return new ResponseEntity<>(new MessageResponse("Producto creado correctamente"), HttpStatus.OK);
	    	}
	    }
	    return new ResponseEntity<>(new MessageResponse("Hubo algún problema, consulte con el administrador"), HttpStatus.BAD_REQUEST);
	}

	@PostMapping("/update")
    public ResponseEntity<?> updateProducto(@RequestBody Producto producto) {
		if(null != producto) {
			producto.setPhoto(null);
			productoService.updateProducto(producto);
    		return new ResponseEntity<>(new MessageResponse("Producto actualizado correctamente"), HttpStatus.OK);
		}
		return new ResponseEntity<>(new MessageResponse("Hubo algún problema, consulte con el administrador"), HttpStatus.BAD_REQUEST);
    }

	@GetMapping("/listaProductos")
	public ResponseEntity<List<Producto>> getAllProductos() {
		List<Producto> listaProductos = productoService.findAll();
		return new ResponseEntity<List<Producto>>(listaProductos, HttpStatus.OK);
    }

	@GetMapping("listaProductosFabrica/{username}")
	public ResponseEntity<List<Producto>> getProductosFabrica(@PathVariable("username") String username) {
		Usuario usuario = userService.findDetailsByUsername(username);
		
		List<Producto> pedidosUsuario = productoService.findAllFabrica(usuario.getId());
		return new ResponseEntity<List<Producto>>(pedidosUsuario, HttpStatus.OK);
    }

	@GetMapping("detail/{id}")
	public ResponseEntity<Producto> getOneById(@RequestParam("id") long id) {
		Producto producto = productoService.findById(id).get();
		return new ResponseEntity<Producto>(producto, HttpStatus.OK);
    }
	
	@PostMapping("/deleteProducto")
    public ResponseEntity<?> deleteProducto(@RequestBody Producto producto) {
		if(null != producto) {
			productoService.deleteProducto(producto);
			return new ResponseEntity<>(new MessageResponse("Producto eliminado correctamente"), HttpStatus.OK);
		}
		
		return new ResponseEntity<>(new MessageResponse("Hubo algún problema, consulte con el administrador"), HttpStatus.BAD_REQUEST);
    }

	@PostMapping("/darStockAlmacen")
    public ResponseEntity<?> darStockAlmacen(@RequestBody Producto producto) {
		if(null != producto) {
			productoService.cambioStock(producto);
			return new ResponseEntity<>(new MessageResponse("Stock actualizado correctamente"), HttpStatus.OK);
		}
		return new ResponseEntity<>(new MessageResponse("Hubo algún problema, consulte con el administrador"), HttpStatus.BAD_REQUEST);
    }
}
