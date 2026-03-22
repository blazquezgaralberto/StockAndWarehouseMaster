--liquibase formatted sql
--changeset stockAndWarehouseMaster tfgAlberto:tabla_pedidos

CREATE SEQUENCE seq_pedidos
    START 1
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9999
    CACHE 1;

CREATE TABLE PEDIDOS (
    ID numeric (4,0) NOT NULL DEFAULT nextval ('seq_pedidos'::regclass),
    NOMBRE character varying(100) NOT NULL,
    TELEFONO character varying(15) NOT NULL,
    OBSERVACIONES character varying(250),
    ID_USUARIO integer NOT NULL,
    ID_CAMION integer NOT NULL,
    PRECIO_FINAL DECIMAL(10,2) NOT NULL,
    FECHA_PEDIDO timestamp NOT NULL,
    FECHA_ENTREGA timestamp,
    FECHA_DEVOLUCION timestamp,
    DIRECCION character varying(1000) NOT NULL,
    CODIGO_POSTAL integer NOT NULL,
    CONSTRAINT pedido_pkey PRIMARY KEY(ID)
);

--changeset stockAndWarehouseMaster tfgAlberto:add_columns_pedidos
ALTER TABLE PEDIDOS ADD COLUMN ESTADO numeric(4,0) NOT NULL;
ALTER TABLE PEDIDOS ADD COLUMN TIPO_ENVIO numeric(4,0) NOT NULL;