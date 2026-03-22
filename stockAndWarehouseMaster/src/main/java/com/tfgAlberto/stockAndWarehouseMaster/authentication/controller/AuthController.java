package com.tfgAlberto.stockAndWarehouseMaster.authentication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tfgAlberto.stockAndWarehouseMaster.authentication.service.AuthService;
import com.tfgAlberto.stockAndWarehouseMaster.payload.request.LoginRequest;
import com.tfgAlberto.stockAndWarehouseMaster.payload.request.SignupRequest;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	AuthService authenticationService;
	
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
		System.out.println(loginRequest.toString());
		return authenticationService.login(loginRequest);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signUpRequest) {
    	System.out.println(signUpRequest.toString());
    	return authenticationService.signup(signUpRequest);
    }
}