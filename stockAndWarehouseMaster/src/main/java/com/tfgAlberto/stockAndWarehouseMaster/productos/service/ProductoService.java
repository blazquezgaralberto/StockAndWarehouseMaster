package com.tfgAlberto.stockAndWarehouseMaster.productos.service;

import java.util.List;
import java.util.Optional;

import com.tfgAlberto.stockAndWarehouseMaster.productos.model.Producto;

public interface ProductoService {

	void insertProducto(Producto producto);
	void updateProducto(Producto producto);
	void updateConFoto(Producto producto);
	List<Producto> findAll();
	List<Producto> findAllFabrica(Long idFabrica);
	Optional<Producto> findById(long id);
	void deleteProducto(Producto producto);
	void cambioStock(Producto producto);
	
	long getStockProducto(long id);
}
