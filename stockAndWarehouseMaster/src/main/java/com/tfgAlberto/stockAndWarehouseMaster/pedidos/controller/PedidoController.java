package com.tfgAlberto.stockAndWarehouseMaster.pedidos.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tfgAlberto.stockAndWarehouseMaster.almacen.model.Almacen;
import com.tfgAlberto.stockAndWarehouseMaster.almacen.service.AlmacenService;
import com.tfgAlberto.stockAndWarehouseMaster.camion.model.Camion;
import com.tfgAlberto.stockAndWarehouseMaster.camion.service.CamionService;
import com.tfgAlberto.stockAndWarehouseMaster.payload.response.MessageResponse;
import com.tfgAlberto.stockAndWarehouseMaster.pedidos.model.Pedido;
import com.tfgAlberto.stockAndWarehouseMaster.pedidos.service.PedidoService;
import com.tfgAlberto.stockAndWarehouseMaster.productos.model.Producto;
import com.tfgAlberto.stockAndWarehouseMaster.productos.service.ProductoService;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.service.UsuarioService;

@RestController()
@RequestMapping("/api/pedido")
public class PedidoController {

	@Autowired
	private PedidoService pedidoService;
	
	@Autowired
	private ProductoService productoService;
	
	@Autowired
	private CamionService camionService;
	
	@Autowired
	private AlmacenService almacenService;

	@Autowired
    private UsuarioService userService;
	
	@Autowired
    public PedidoController(PedidoService pedidoService,ProductoService productoService, CamionService camionService) {
        this.pedidoService = pedidoService;
        this.productoService = productoService;
        this.camionService = camionService;
    }

	@PostMapping("/newPedido")
    public ResponseEntity<?> insertPedido(@RequestBody Pedido pedido) {

		if(null != pedido && !pedido.getListaProductos().isEmpty()) {//comprobar pedido vacío
			if(this.comprobarStocks(pedido)) {
				//buscar almacenes
				List<Almacen> almacenes = buscarAlmacenesParaPedido(pedido);

				if(!almacenes.isEmpty()){
					pedido.setListaAlmacenesProducto(almacenes);

					Camion camionRepartoPedido = camionService.getFirstLibre();
					if(null != camionRepartoPedido) {
						pedido.setCamionPedido(camionRepartoPedido);
						pedido.setIdCamion(camionRepartoPedido.getId());

						pedidoService.insertPedido(pedido);
						return new ResponseEntity<>(new MessageResponse("Pedido creado correctamente"), HttpStatus.OK);
					}else {
						return new ResponseEntity<>(new MessageResponse("Algo salió mal, camiones no disponibles, vuelva a intentarlo"), HttpStatus.BAD_REQUEST);
					}
				}else {
					return new ResponseEntity<>(new MessageResponse("Algo salió mal, por favor revise su pedido"), HttpStatus.BAD_REQUEST);
				}
				
			}else {
				return new ResponseEntity<>(new MessageResponse("No hay stocks disponibles, por favor revise su pedido"), HttpStatus.BAD_REQUEST);
			}

		}else {
			return new ResponseEntity<>(new MessageResponse("Pedido vacío"), HttpStatus.BAD_REQUEST);
		}
		
    }
	
	private boolean comprobarStocks(Pedido pedido){
		//comprueba que hay suficiente stock para todos lor productos del pedido
	    return pedido.getListaProductos().stream()
	            .allMatch(prod -> productoService.getStockProducto(prod.getId()) >= prod.getCantidadProductoPedido());
	}
	
	private List<Almacen> buscarAlmacenesParaPedido(Pedido pedido) {
		List<Producto> productosPedido = pedido.getListaProductos();
	    List<Almacen> almacenes = new ArrayList<>();

	    for (Producto producto : productosPedido) {
	        // Buscar almacenes que contengan el producto actual
	        List<Almacen> almacenesConStockProducto = almacenService.getAlmacenesWithStockByProductoId(producto.getId(),producto.getCantidadProductoPedido());

	        for(Almacen almacen : almacenesConStockProducto) {
	        	if (tieneStockDeOtrosProductos(almacen, productosPedido, producto)) {
	        		almacen.setListaProductos(productosPedido);
                    almacenes.add(almacen);
                    return almacenes;
                }
	        }
	    }

	    if(almacenes.isEmpty()) {
	    	for (Producto producto : productosPedido) {
	    		// Buscar almacenes que contengan el producto actual
		        List<Almacen> almacenesConStockProducto = almacenService.getAlmacenesWithStockByProductoId(producto.getId(),producto.getCantidadProductoPedido());
		        
		        if(!almacenesConStockProducto.isEmpty()) {
		        	Almacen primerAlmacenConStock = almacenesConStockProducto.get(0);
		        	if (!almacenes.contains(primerAlmacenConStock)) {
		        		primerAlmacenConStock.setListaProductos(new ArrayList<>());
		        		primerAlmacenConStock.getListaProductos().add(producto);
		                almacenes.add(primerAlmacenConStock);
		            }else{
		            	for (Almacen alm : almacenes) {
		                    if (alm.equals(primerAlmacenConStock)) {
		                    	alm.getListaProductos().add(producto);
		                        break;
		                    }
		                }
		            }
		        }else {
		        	return null;
		        }
	    	}
	    }
	    return almacenes;
	}

	//verificar si un almacén tiene stock de los otros productos del pedido
	private boolean tieneStockDeOtrosProductos(Almacen almacen, List<Producto> productosPedido, Producto productoActual) {
	    for (Producto producto : productosPedido) {
	        if (producto.equals(productoActual)) {
	            continue;
	        }

	        var stock = almacenService.getStockByProductIdAndAlmacenId(producto.getId(), almacen.getId());
	        if (stock == null || stock <= 0) {
	            return false;
	        }
	    }
	    return true;//tiene stock de todos los productos
	}

	@GetMapping("listaPedidosUsuario/{username}")
	public ResponseEntity<List<Pedido>> getPedidosByUsername(@PathVariable("username") String username) {
		Usuario usuario = userService.findDetailsByUsername(username);
		
		List<Pedido> pedidosUsuario = pedidoService.findAllPedidosUsuario(usuario.getId());
		return new ResponseEntity<List<Pedido>>(pedidosUsuario, HttpStatus.OK);
    }

	@GetMapping("listaPedidosAlmacen/{username}")
	public ResponseEntity<List<Pedido>> getPedidosUserAlmacen(@PathVariable("username") String username) {
		Usuario usuario = userService.findDetailsByUsername(username);
		List<Pedido> pedidosAlmacen = pedidoService.findPedidosAlmacen(usuario);
		return new ResponseEntity<List<Pedido>>(pedidosAlmacen, HttpStatus.OK);
    }

	@GetMapping("/listaPedidosTotales")
	public ResponseEntity<List<Pedido>> getAllPedidos() {
		List<Pedido> listaPedidos = pedidoService.findAll();
		return new ResponseEntity<List<Pedido>>(listaPedidos, HttpStatus.OK);
    }

	@GetMapping("detail/{id}")
	public ResponseEntity<Pedido> getPedidoDetail(@PathVariable("id") long id) {
		Pedido pedido = pedidoService.findById(id);
		return new ResponseEntity<Pedido>(pedido, HttpStatus.OK);
    }

	@PostMapping("/aceptarPedido")
    public ResponseEntity<?> aceptarPedido(@RequestBody Pedido pedido) {
	    if(null != pedido && null != pedido.getId()) {
	    	pedidoService.procesoCambioEstadosPedido(pedido);
	    	return new ResponseEntity<>(new MessageResponse("Pedido aceptado"), HttpStatus.OK);
	    }
	    return new ResponseEntity<>(new MessageResponse("Hubo algún problema, consulte con el administrador"), HttpStatus.BAD_REQUEST);
    }
}
