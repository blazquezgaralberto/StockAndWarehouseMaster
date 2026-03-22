package com.tfgAlberto.stockAndWarehouseMaster.almacen.service;

import java.util.List;
import java.util.Optional;

import com.tfgAlberto.stockAndWarehouseMaster.almacen.model.Almacen;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;
import com.tfgAlberto.stockAndWarehouseMaster.util.Utilidades;

public interface AlmacenService {

	List<Utilidades> find(Integer id);
	
	void insertAlmacen(Almacen producto);
	void updateAlmacen(Almacen producto);
	void createAlmacenByUser(Usuario usuarioAlmacen);
	List<Almacen> findAllActives();
	List<Almacen> findAllComplete();
	Optional<Almacen> findById(long id);
	void deleteAlmacenByIdUsuario(Long idUsuario);
	
	List<Almacen> getAlmacenesByProductoId(long id);
	List<Almacen> getAlmacenesWithStockByProductoId(long id, long cantidad);
	Integer getStockByProductIdAndAlmacenId(long productoId, long almacenId);
}
