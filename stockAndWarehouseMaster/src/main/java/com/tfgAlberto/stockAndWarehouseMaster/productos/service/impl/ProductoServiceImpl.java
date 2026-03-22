package com.tfgAlberto.stockAndWarehouseMaster.productos.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgAlberto.stockAndWarehouseMaster.productos.mapper.ProductoMapper;
import com.tfgAlberto.stockAndWarehouseMaster.productos.model.Producto;
import com.tfgAlberto.stockAndWarehouseMaster.productos.service.ProductoService;

@Service
public class ProductoServiceImpl implements ProductoService {

	private final ProductoMapper productoMapper;
	
	@Autowired
    public ProductoServiceImpl(ProductoMapper productoMapper) {
        this.productoMapper = productoMapper;
    }
	
	@Override
	public void insertProducto(Producto producto) {
		productoMapper.insert(producto);
	}

	@Override
	public void updateProducto(Producto producto) {
		productoMapper.update(producto);
	}
	
	@Override
	public void updateConFoto(Producto producto) {
		productoMapper.updateConFoto(producto);
	}
	
	@Override
	public List<Producto> findAll() {
		return productoMapper.findAll();
	}

	@Override
	public List<Producto> findAllFabrica(Long idFabrica) {
		return productoMapper.findAllFabrica(idFabrica);
	}
	@Override
	public Optional<Producto> findById(long id) {
		return productoMapper.findById(id);
	}

	@Override
	public void deleteProducto(Producto producto) {
		productoMapper.delete(producto);
	}
	
	@Override
	public void cambioStock(Producto producto) {
		productoMapper.cambioStockProducto(producto.getStockParaAlmacen(), producto.getId());
		if(!productoMapper.existsProductoAlmacen(producto.getId(), producto.getIdAlmacen())) {
			productoMapper.insertStockProductoAlmacen(producto);
		}else {
			productoMapper.cambioStockProductoAlmacen(producto);
		}
	}

	@Override
	public long getStockProducto(long id) {
		return productoMapper.getStockProducto(id);
	}

}
