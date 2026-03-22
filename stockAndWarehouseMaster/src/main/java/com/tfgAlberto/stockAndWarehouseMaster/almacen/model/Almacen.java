package com.tfgAlberto.stockAndWarehouseMaster.almacen.model;

import java.util.List;

import com.tfgAlberto.stockAndWarehouseMaster.camion.model.Camion;
import com.tfgAlberto.stockAndWarehouseMaster.pedidos.model.Pedido;
import com.tfgAlberto.stockAndWarehouseMaster.productos.model.Producto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Almacen{

	private Long id;
	private String nombre;
	private String ubicacion;
	private boolean activo;
	private Long userId;

	private List<Producto> listaProductos;
	private List<Camion> listaCamiones;
	private List<Pedido> listaPedidos;

}
