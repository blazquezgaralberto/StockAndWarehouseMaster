package com.tfgAlberto.stockAndWarehouseMaster.pedidos.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.tfgAlberto.stockAndWarehouseMaster.pedidos.model.Pedido;

@Mapper
public interface PedidoMapper {

	void insert(Pedido pedido);
	
	void insertProductosPedido(@Param("idProducto") long idProducto,@Param("cantidad") long cantidad);
	void insertAlamcenesPedido(@Param("idAlmacen") long idAlmacen, @Param("idProducto") long idProducto,@Param("cantidad") long cantidad);

	List<Pedido> findAllPedidosUsuario(@Param("userId") long userId);
	List<Pedido> findPedidosAlmacen(@Param("almacenID") long almacenID);
	List<Pedido> findAll();
	Pedido findById(long id);
	void update(Pedido pedido);
}
