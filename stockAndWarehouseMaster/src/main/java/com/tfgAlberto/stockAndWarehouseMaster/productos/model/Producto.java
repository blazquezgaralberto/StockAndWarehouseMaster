package com.tfgAlberto.stockAndWarehouseMaster.productos.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producto{

	private Long id;
	private String nombre;
	private float precio;
	private long stock;
	private Integer categoria;
	private Boolean disponible;
	private long idFabricante;
	private byte[] photo;
	private String descripcion;

	private Long idAlmacen;
	private long stockParaAlmacen;
	
	private long cantidadProductoPedido;
	private float precioCantidadTotal;
}
