package com.tfgAlberto.stockAndWarehouseMaster.camion.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgAlberto.stockAndWarehouseMaster.camion.mapper.CamionMapper;
import com.tfgAlberto.stockAndWarehouseMaster.camion.model.Camion;
import com.tfgAlberto.stockAndWarehouseMaster.camion.service.CamionService;

@Service
public class CamionServiceImpl implements CamionService{

	private final CamionMapper camionMapper;
	
	@Autowired
    public CamionServiceImpl(CamionMapper camionMapper) {
        this.camionMapper = camionMapper;
    }

	@Override
	public void insertCamion(Camion producto) {
		camionMapper.insert(producto);
	}

	@Override
	public void updateCamion(Camion camion) {
		camionMapper.update(camion);
	}

	@Override
	public List<Camion> findAll() {
		return camionMapper.findAll();
	}

	@Override
	public Optional<Camion> findById(long id) {
		return camionMapper.findById(id);
	}

	@Override
	public void deleteCamion(Camion producto) {
		camionMapper.delete(producto);
	}

	@Override
	public Camion getFirstLibre() {
		Camion camionLibre = camionMapper.getFirstLibre();
		if(null == camionLibre) {
			camionLibre = camionMapper.getPrimerCamionEstadoOcupado();
			camionLibre.setEstado(12);
			camionMapper.cambiarEstadoCamion(camionLibre.getId(), camionLibre.getEstado());
		}
		return camionLibre;
	}
}
