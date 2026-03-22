package com.tfgAlberto.stockAndWarehouseMaster.pedidos.model;

import java.util.Date;
import java.util.List;

import com.tfgAlberto.stockAndWarehouseMaster.almacen.model.Almacen;
import com.tfgAlberto.stockAndWarehouseMaster.camion.model.Camion;
import com.tfgAlberto.stockAndWarehouseMaster.productos.model.Producto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pedido{

	private Long id;
	private String nombre;
	private String telefono;
	private String observaciones;
	private float precioFinal;
	private Date fechaPedido;
	private Date fechaEntrega;
	private Date fechaDevolucion;
	private String direccionEntrega;
	private Integer codigoPostal;
	private Long idUsuario;
	private Long idCamion;
	private Integer estado;
	private Integer tipoEnvio;

	private Camion camionPedido;
	private List<Producto> listaProductos;
	private List<Almacen> listaAlmacenesProducto;

}