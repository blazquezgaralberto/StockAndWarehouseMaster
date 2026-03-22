package com.tfgAlberto.stockAndWarehouseMaster.camion.controller;

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

import com.tfgAlberto.stockAndWarehouseMaster.camion.model.Camion;
import com.tfgAlberto.stockAndWarehouseMaster.camion.service.CamionService;
import com.tfgAlberto.stockAndWarehouseMaster.payload.response.MessageResponse;

@RestController()
@RequestMapping("/api/camion")
public class CamionController {

	@Autowired
	private CamionService camionService;
	
	@Autowired
    public CamionController(CamionService camionService) {
        this.camionService = camionService;
    }
	
	@PostMapping("/newCamion")
    public ResponseEntity<?> insertCamion(@RequestBody Camion camion) {
		if(null != camion) {
			if(null != camion.getId()) {
				camionService.updateCamion(camion);
				return new ResponseEntity<>(new MessageResponse("Camión actualizado correctamente"), HttpStatus.OK);
			}
			camionService.insertCamion(camion);
			return new ResponseEntity<>(new MessageResponse("Camión creado correctamente"), HttpStatus.OK);
		}
		return new ResponseEntity<>(new MessageResponse("Hubo algún problema, consulte con el administrador"), HttpStatus.BAD_REQUEST);
    }

	@GetMapping("/listaCamiones")
	public ResponseEntity<List<Camion>> getAllCamiones() {
		List<Camion> listaProductos = camionService.findAll();
		return new ResponseEntity<List<Camion>>(listaProductos, HttpStatus.OK);
    }
	
	@GetMapping("detail/{id}")
	public ResponseEntity<Camion> getOneById(@RequestParam("id") long id) {
		Camion producto = camionService.findById(id).get();
		return new ResponseEntity<Camion>(producto, HttpStatus.OK);
    }

	@PostMapping("/deleteCamion")
    public ResponseEntity<?> deleteCamion(@RequestBody Camion camion) {
		if(null != camion) {
			camionService.deleteCamion(camion);
			return new ResponseEntity<>(new MessageResponse("Camión eliminado correctamente"), HttpStatus.OK);
		}
		return new ResponseEntity<>(new MessageResponse("Hubo algún problema, consulte con el administrador"), HttpStatus.BAD_REQUEST);
    }
	
}