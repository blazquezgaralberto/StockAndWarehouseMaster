package com.tfgAlberto.stockAndWarehouseMaster.payload.response;

import java.util.List;

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
public class JwtResponse {

	private String token;
	private Long id;
	private String uname;
	private String email;
	private List<String> roles;

}