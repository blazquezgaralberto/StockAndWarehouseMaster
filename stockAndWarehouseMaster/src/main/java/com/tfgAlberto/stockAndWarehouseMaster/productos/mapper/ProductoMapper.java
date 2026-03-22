package com.tfgAlberto.stockAndWarehouseMaster.productos.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.tfgAlberto.stockAndWarehouseMaster.productos.model.Producto;

@Mapper
public interface ProductoMapper {

	void insert(Producto producto);
	void update(Producto producto);
	void updateConFoto(Producto producto);
	List<Producto> findAll();
	List<Producto> findAllFabrica(Long idFabrica);
	Optional<Producto> findById(long id);
	void delete(Producto producto);

	void cambioStockProducto(@Param("stockParaAlmacen") long stockParaAlmacen,@Param("id") long id);
	boolean existsProductoAlmacen(@Param("idProd") long idProd, @Param("idAlm") long idAlm);

	void cambioStockProductoAlmacen(Producto producto);
	void insertStockProductoAlmacen(Producto producto);
	
	void restarCantidadStockProducto(@Param("idProd") long idProd, @Param("cantidad") long cantidad);
	void restarCantidadStockAlmacen(@Param("idProd") long idProd, @Param("idAlmacen") long idAlmacen, @Param("cantidad") long cantidad);
	
	long getStockProducto(long id);
	
	List<Producto> findProductosRepartoPedido(@Param("idPedido") long idPedido,@Param("idAlmacen") long idAlmacen);
}
