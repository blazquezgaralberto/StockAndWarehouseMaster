package com.tfgAlberto.stockAndWarehouseMaster.almacen.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgAlberto.stockAndWarehouseMaster.almacen.mapper.AlmacenMapper;
import com.tfgAlberto.stockAndWarehouseMaster.almacen.model.Almacen;
import com.tfgAlberto.stockAndWarehouseMaster.almacen.service.AlmacenService;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;
import com.tfgAlberto.stockAndWarehouseMaster.util.Utilidades;

@Service
public class AlmacenServiceImpl implements AlmacenService {

	private final AlmacenMapper almacenMapper;
	
	@Autowired
    public AlmacenServiceImpl(AlmacenMapper almacenMapper) {
        this.almacenMapper = almacenMapper;
    }

	@Override
	public List<Utilidades> find(Integer id) {
		return almacenMapper.find(id);
	}

	@Override
	public void insertAlmacen(Almacen almacen) {
		almacenMapper.insert(almacen);
	}

	@Override
	public void updateAlmacen(Almacen almacen) {
		almacenMapper.update(almacen);
	}

	@Override
	public List<Almacen> findAllActives() {
		return almacenMapper.findAllActives();
	}
	
	@Override
	public List<Almacen> findAllComplete() {
		return almacenMapper.findAllComplete();
	}

	@Override
	public Optional<Almacen> findById(long id) {
		return almacenMapper.findById(id);
	}

	@Override
	public void deleteAlmacenByIdUsuario(Long idUsuario) {
		almacenMapper.deleteAlmacenByIdUsuario(idUsuario);
	}

	@Override
	public void createAlmacenByUser(Usuario usuario) {
		Almacen almacenByUser = new Almacen();
		almacenByUser.setNombre(usuario.getNombre());
		almacenByUser.setUbicacion(usuario.getUbicacion());
		almacenByUser.setUserId(usuario.getId());
		almacenMapper.insert(almacenByUser);
	}

	@Override
	public List<Almacen> getAlmacenesByProductoId(long id) {
		return almacenMapper.getAlmacenesByProductoId(id);
	}
	
	@Override
	public List<Almacen> getAlmacenesWithStockByProductoId(long id, long cantidad) {
		return almacenMapper.getAlmacenesWithStockByProductoId(id, cantidad);
	}
	

	@Override
	public Integer getStockByProductIdAndAlmacenId(long productoId, long almacenId) {
		return almacenMapper.getStockByProductIdAndAlmacenId(productoId, almacenId);
	}
}
