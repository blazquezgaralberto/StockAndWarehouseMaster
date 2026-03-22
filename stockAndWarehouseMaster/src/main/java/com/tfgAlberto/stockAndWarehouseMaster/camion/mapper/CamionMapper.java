package com.tfgAlberto.stockAndWarehouseMaster.camion.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.tfgAlberto.stockAndWarehouseMaster.camion.model.Camion;

@Mapper
public interface CamionMapper {

	void insert(Camion camion);
	void update(Camion camion);
	List<Camion> findAll();
	Optional<Camion> findById(long id);
	void delete(Camion producto);
	void cambiarEstadoCamion(@Param("idCamion") long idCamion, @Param("estado") long estado);
	Camion getFirstLibre();
	Camion getPrimerCamionEstadoOcupado();
}
