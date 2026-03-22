package com.tfgAlberto.stockAndWarehouseMaster.payload.request;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SignupRequest {

	private String name;
	private String username;
	private String password;
	private String email;
	private Set<String> roles;
}