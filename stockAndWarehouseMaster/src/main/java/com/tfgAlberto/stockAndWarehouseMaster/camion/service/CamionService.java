package com.tfgAlberto.stockAndWarehouseMaster.camion.service;

import java.util.List;
import java.util.Optional;

import com.tfgAlberto.stockAndWarehouseMaster.camion.model.Camion;

public interface CamionService {

	void insertCamion(Camion camion);
	void updateCamion(Camion camion);
	List<Camion> findAll();
	Optional<Camion> findById(long id);
	void deleteCamion(Camion camion);
	
	Camion getFirstLibre();
}
