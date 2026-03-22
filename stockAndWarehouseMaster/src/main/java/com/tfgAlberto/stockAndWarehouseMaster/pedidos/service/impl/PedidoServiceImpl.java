package com.tfgAlberto.stockAndWarehouseMaster.pedidos.service.impl;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tfgAlberto.stockAndWarehouseMaster.almacen.mapper.AlmacenMapper;
import com.tfgAlberto.stockAndWarehouseMaster.almacen.model.Almacen;
import com.tfgAlberto.stockAndWarehouseMaster.camion.mapper.CamionMapper;
import com.tfgAlberto.stockAndWarehouseMaster.correoService.impl.MailServiceImpl;
import com.tfgAlberto.stockAndWarehouseMaster.pedidos.mapper.PedidoMapper;
import com.tfgAlberto.stockAndWarehouseMaster.pedidos.model.Pedido;
import com.tfgAlberto.stockAndWarehouseMaster.pedidos.service.PedidoService;
import com.tfgAlberto.stockAndWarehouseMaster.productos.mapper.ProductoMapper;
import com.tfgAlberto.stockAndWarehouseMaster.productos.model.Producto;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.mapper.UsuarioMapper;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;

import jakarta.mail.MessagingException;

@Service
public class PedidoServiceImpl implements PedidoService {

	@Autowired
	private MailServiceImpl mailSender;

	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

	private final PedidoMapper pedidoMapper;
	private final AlmacenMapper almacenMapper;
	private final ProductoMapper productoMapper;
	private final CamionMapper camionMapper;
	private final UsuarioMapper usuarioMapper;
	
	@Autowired
    public PedidoServiceImpl(PedidoMapper pedidoMapper, AlmacenMapper almacenMapper,
    							ProductoMapper productoMapper, CamionMapper camionMapper,
    							UsuarioMapper usuarioMapper) {
        this.pedidoMapper = pedidoMapper;
        this.almacenMapper = almacenMapper;
        this.productoMapper = productoMapper;
        this.camionMapper = camionMapper;
        this.usuarioMapper = usuarioMapper;
    }
	
	public void insertPedido(Pedido pedido) {
		Calendar calendar = Calendar.getInstance();
		Date fechaActual = calendar.getTime();
		pedido.setFechaPedido(fechaActual);
		pedido.setEstado(5);
		pedidoMapper.insert(pedido);

		camionMapper.cambiarEstadoCamion(pedido.getIdCamion(), 13);

		for(Almacen almacen: pedido.getListaAlmacenesProducto()) {
			for(Producto productoAlm: almacen.getListaProductos()) {
				pedidoMapper.insertAlamcenesPedido(almacen.getId(), productoAlm.getId(), productoAlm.getCantidadProductoPedido());
				productoMapper.restarCantidadStockProducto(productoAlm.getId(), productoAlm.getCantidadProductoPedido());
				productoMapper.restarCantidadStockAlmacen(productoAlm.getId(),almacen.getId() ,productoAlm.getCantidadProductoPedido());
			}

		}
	}

	@Override
	public List<Pedido> findAllPedidosUsuario(Long userId) {
		List<Pedido> listaPedidos = pedidoMapper.findAllPedidosUsuario(userId);
		for(Pedido p: listaPedidos) {
			List<Almacen> almacenesRepartoPedido = almacenMapper.findAlmacenesRepartoPedido(p.getId());
			p.setListaAlmacenesProducto(almacenesRepartoPedido);
			
			if(!almacenesRepartoPedido.isEmpty()) {
				for(Almacen al: almacenesRepartoPedido) {
					List<Producto> productosRepartidosCadaAlmacen = productoMapper.findProductosRepartoPedido(p.getId(), al.getId());
					al.setListaProductos(productosRepartidosCadaAlmacen);
				}
			}
		}
		return listaPedidos;
	}

	@Override
	public List<Pedido> findPedidosAlmacen(Usuario usuario) {
		Almacen almacen = almacenMapper.findByIdUsuario(usuario.getId());
		List<Pedido> listaPedidos = new ArrayList<>();
		if(null != almacen) {
			listaPedidos = pedidoMapper.findPedidosAlmacen(almacen.getId());
			for(Pedido p: listaPedidos) {
				List<Producto> productosPedidp = productoMapper.findProductosRepartoPedido(p.getId(), almacen.getId());
				p.setListaProductos(productosPedidp);
			}
			return listaPedidos;
		}

		return listaPedidos;
	}

	@Override
	public List<Pedido> findAll() {
		List<Pedido> listaPedidos  =  pedidoMapper.findAll();
		for(Pedido p: listaPedidos) {
			List<Almacen> almacenesRepartoPedido = almacenMapper.findAlmacenesRepartoPedido(p.getId());
			p.setListaAlmacenesProducto(almacenesRepartoPedido);

			List<Producto> listaProductosPedido =  new ArrayList<>();

			if(!almacenesRepartoPedido.isEmpty()) {
				for(Almacen al: almacenesRepartoPedido) {
					List<Producto> productosRepartidosCadaAlmacen = productoMapper.findProductosRepartoPedido(p.getId(), al.getId());
					al.setListaProductos(productosRepartidosCadaAlmacen);
					listaProductosPedido.addAll(productosRepartidosCadaAlmacen);
				}

				p.setListaProductos(listaProductosPedido);
			}

		}
		return listaPedidos;

	}

	@Override
	public Pedido findById(long id) {
		Pedido pedido = pedidoMapper.findById(id);
		List<Almacen> almacenesRepartoPedido = almacenMapper.findAlmacenesRepartoPedido(pedido.getId());
		pedido.setListaAlmacenesProducto(almacenesRepartoPedido);
		if(!almacenesRepartoPedido.isEmpty()) {
			for(Almacen al: almacenesRepartoPedido) {
				List<Producto> productosRepartidosCadaAlmacen = productoMapper.findProductosRepartoPedido(pedido.getId(), al.getId());
				al.setListaProductos(productosRepartidosCadaAlmacen);
			}
		}
		return pedido;
	}

	@Override
	public void procesoCambioEstadosPedido(Pedido pedido) {
		try {
			scheduler.scheduleAtFixedRate(() -> {
				Pedido pedidoActualizadoEstado = pedidoMapper.findById(pedido.getId());
				Usuario detalleUsuario = usuarioMapper.findDetailsById(pedido.getIdUsuario());

			    if (pedidoActualizadoEstado.getEstado() <= 8) {
			        int nuevoEstado = pedidoActualizadoEstado.getEstado() + 1;
			        pedidoActualizadoEstado.setEstado(nuevoEstado);
			        pedidoMapper.update(pedidoActualizadoEstado);
			        
			        if(nuevoEstado == 6) {
			        	try {
							mailSender.sendMessagePedidoAceptado(detalleUsuario, pedido);
						} catch (UnsupportedEncodingException | MessagingException e) {
							e.printStackTrace();
						}
			        	
			        }else if(nuevoEstado == 8) {
			        	
			        	Calendar calendar = Calendar.getInstance();
						Date fechaActual = calendar.getTime();
						pedido.setFechaPedido(fechaActual);
						pedidoActualizadoEstado.setFechaEntrega(fechaActual);
						pedidoMapper.update(pedidoActualizadoEstado);
						camionMapper.cambiarEstadoCamion(pedidoActualizadoEstado.getIdCamion(), 12);
				    	try {
							mailSender.sendMessageEnvioEntregado(detalleUsuario, pedido);
						} catch (UnsupportedEncodingException | MessagingException e) {
							e.printStackTrace();
						}
			        }

			    }

			}, 0, 30, TimeUnit.SECONDS);
			System.out.println("Tarea programada ejecutada");
		} catch (Exception e) {
			System.err.println("Error al ejecutar la tarea programada: " + e.getMessage());
		}
	}

}
