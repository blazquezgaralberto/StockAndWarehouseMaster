package com.tfgAlberto.stockAndWarehouseMaster.authentication.service;

import org.springframework.http.ResponseEntity;

import com.tfgAlberto.stockAndWarehouseMaster.payload.request.LoginRequest;
import com.tfgAlberto.stockAndWarehouseMaster.payload.request.SignupRequest;

import jakarta.validation.Valid;

public interface AuthService {

	ResponseEntity<?> login(@Valid LoginRequest loginRequest);

	ResponseEntity<?> signup(@Valid SignupRequest signUpRequest);


}
