package com.tfgAlberto.stockAndWarehouseMaster.almacen.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.tfgAlberto.stockAndWarehouseMaster.almacen.model.Almacen;
import com.tfgAlberto.stockAndWarehouseMaster.util.Utilidades;

@Mapper
public interface AlmacenMapper {

	List<Utilidades> find(@Param("tipo") Integer tipo);

	void insert(Almacen almacen);
	void update(Almacen almacen);
	List<Almacen> findAllActives();
	List<Almacen> findAllComplete();
	Optional<Almacen> findById(long id);
	Almacen findByIdUsuario(long id);
	void deleteAlmacenByIdUsuario(@Param("idUsuario") Long idUsuario);
	
	Integer getStockByProductIdAndAlmacenId(@Param("productId") long productId, @Param("almacenId") long almacenId);
	List<Almacen> getAlmacenesByProductoId(long productId);
	List<Almacen> getAlmacenesWithStockByProductoId(@Param("id") long id, @Param("cantidad") long cantidad);

	List<Almacen> findAlmacenesRepartoPedido(@Param("idPedido") Long idPedido);
}
