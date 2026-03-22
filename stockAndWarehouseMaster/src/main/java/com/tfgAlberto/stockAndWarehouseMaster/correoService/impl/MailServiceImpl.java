package com.tfgAlberto.stockAndWarehouseMaster.correoService.impl;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.tfgAlberto.stockAndWarehouseMaster.correoService.MailService;
import com.tfgAlberto.stockAndWarehouseMaster.pedidos.model.Pedido;
import com.tfgAlberto.stockAndWarehouseMaster.usuarios.model.Usuario;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailServiceImpl implements MailService {

	@Autowired
	private JavaMailSender mailSender;
	
	public void correoConfirmacionCuenta(Usuario user) throws MessagingException, UnsupportedEncodingException {
		String asunto = "Cuentra creada correctamente";
		String mensaje = "¡Gracias por unirte a la familia SWAM!\n";
	    mensaje += "Su registro ha sido realizado correctamente\n";
	    mensaje += user.getNombre() + ", estos son sus datos de registro:\n";
	    mensaje += "Email: " + user.getEmail() + "\n";
	    mensaje += "Nombre de usuario: " + user.getUsername() + "\n";
		this.sendSimpleMessage(user, asunto, mensaje);
	}

	public void sendSimpleMessage(Usuario user, String asunto, String cuerpoMensaje) throws MessagingException, UnsupportedEncodingException {
		
        MimeMessage message = mailSender.createMimeMessage();
        
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(new InternetAddress("test@stockAndWarehouseMaster.com","test@stockAndWarehouseMaster.com"));
        helper.setTo(user.getEmail());
        helper.setSubject(asunto);
        helper.setText(cuerpoMensaje);
        mailSender.send(message);
	}

	
	public void sendMessagePedidoAceptado(Usuario usuario, Pedido pedido) throws MessagingException, UnsupportedEncodingException {
		String asunto = "Pedido aceptado";
		String mensaje = "¡Tu pedido ha sido aceptado y saldrá de nuestros almacenes en las próximas horas!\n";
		mensaje += "\n";
	    mensaje += "DETALLES DE SU PEDIDO\n";
	    mensaje += "Número de pedido: " + pedido.getId() + "\n";
		this.sendSimpleMessage(usuario, asunto, mensaje);
	}

	public void sendMessageEnvioEntregado(Usuario usuario, Pedido pedido) throws MessagingException, UnsupportedEncodingException {
		String asunto = "Pedido entregado";
		String mensaje = "¡Tu pedido ha sido entregado en" + pedido.getDireccionEntrega() + "!\n";
		mensaje += "\n";
	    mensaje += "Que disfrute de su pedido\n";
	    mensaje += "Gracias por confiar en SAWM\n";
		this.sendSimpleMessage(usuario, asunto, mensaje);
	}
}
