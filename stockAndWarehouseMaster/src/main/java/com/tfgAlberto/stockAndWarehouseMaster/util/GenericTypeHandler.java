package com.tfgAlberto.stockAndWarehouseMaster.util;

import java.io.Serializable;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeHandler;

public class GenericTypeHandler<E extends Serializable> implements TypeHandler<E> {

	@Override
	public void setParameter(PreparedStatement ps, int i, E parameter, JdbcType jdbcType) throws SQLException {
	    if (parameter != null) {
	        ps.setObject(i, parameter);
	    } else {
	        ps.setNull(i, jdbcType.TYPE_CODE);
	    }
	}

	@Override
	public E getResult(ResultSet rs, String columnName) throws SQLException {
		return null;
	}

	@Override
	public E getResult(ResultSet rs, int columnIndex) throws SQLException {
		return null;
	}

	@Override
	public E getResult(CallableStatement cs, int columnIndex) throws SQLException {
		return null;
	}
	

}
