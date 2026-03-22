package com.tfgAlberto.stockAndWarehouseMaster.camion.model;

import java.util.List;

import com.tfgAlberto.stockAndWarehouseMaster.almacen.model.Almacen;
import com.tfgAlberto.stockAndWarehouseMaster.pedidos.model.Pedido;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Camion{

	private Long id;
	private String marca;
	private String matricula;
	private double capacidadCarga;
	private int estado;

	private List<Pedido> listaPedidosReparteCamion;
	private List<Almacen> listaAlmacenesCamion;

}