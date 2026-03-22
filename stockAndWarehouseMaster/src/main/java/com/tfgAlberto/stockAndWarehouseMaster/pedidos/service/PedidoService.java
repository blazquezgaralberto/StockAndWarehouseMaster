package com.tfgAlberto.stockAndWarehouseMaster.pedidos.service;

import java.util.List;

import com.tfgAlberto.stockAndWarehouseMaster.pedidos.model.Pedido;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;

public interface PedidoService {

	void insertPedido(Pedido pedido);
	List<Pedido> findAllPedidosUsuario(Long userId);
	List<Pedido> findPedidosAlmacen(Usuario usuario);
	List<Pedido> findAll();
	Pedido findById(long id);
	void procesoCambioEstadosPedido(Pedido pedido);
}
