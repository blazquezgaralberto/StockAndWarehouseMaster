package com.tfgAlberto.stockAndWarehouseMaster.almacen.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tfgAlberto.stockAndWarehouseMaster.almacen.model.Almacen;
import com.tfgAlberto.stockAndWarehouseMaster.almacen.service.AlmacenService;
import com.tfgAlberto.stockAndWarehouseMaster.payload.response.MessageResponse;
import com.tfgAlberto.stockAndWarehouseMaster.util.Utilidades;

@RestController()
@RequestMapping("/api/almacen")
public class AlmacenController {

	@Autowired
	private AlmacenService almacenService;

	@Autowired
    public AlmacenController(AlmacenService almacenService) {
        this.almacenService = almacenService;
    }

	@PostMapping("/getDesplegables")
    public ResponseEntity<List<Utilidades>> getDesplegables(@RequestBody Integer id) {
		List<Utilidades> desplegable = almacenService.find(id);
		return new ResponseEntity<>(desplegable, HttpStatus.OK);
    }

	@PostMapping("/newAlmacen")
    public ResponseEntity<?> insertAlmacen(@RequestBody Almacen almacen) {
		if(null != almacen) {
			if(null != almacen.getId()) {
				almacenService.updateAlmacen(almacen);
				return new ResponseEntity<>(new MessageResponse("Almacén actualizado correctamente"), HttpStatus.OK);
			}
			almacenService.insertAlmacen(almacen);
		}
		return new ResponseEntity<>(new MessageResponse("Hubo algún problema, consulte con el administrador"), HttpStatus.BAD_REQUEST);
    }

	@GetMapping("/listaCompletaAlmacenes")
	public ResponseEntity<List<Almacen>> getAllAlmacenesIncludeFalses() {
		List<Almacen> listaProductos = almacenService.findAllComplete();
		return new ResponseEntity<List<Almacen>>(listaProductos, HttpStatus.OK);
    }

	@GetMapping("/listaAlmacenesActivos")
	public ResponseEntity<List<Almacen>> getAllActives() {
		List<Almacen> listaProductos = almacenService.findAllActives();
		return new ResponseEntity<List<Almacen>>(listaProductos, HttpStatus.OK);
    }
	
	@GetMapping("detail/{id}")
	public ResponseEntity<Almacen> getOneById(@RequestParam("id") long id) {
		Almacen almacen = almacenService.findById(id).get();
		return new ResponseEntity<Almacen>(almacen, HttpStatus.OK);
    }
	
}
