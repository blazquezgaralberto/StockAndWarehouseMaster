--liquibase formatted sql
--changeset stockAndWarehouseMaster tfgAlberto:tabla_producto

CREATE SEQUENCE seq_producto
    START 1
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9999
    CACHE 1;

CREATE TABLE PRODUCTOS (
    ID numeric (4,0) NOT NULL DEFAULT nextval ('seq_producto'::regclass),
    NOMBRE character varying(80) NOT NULL,
    PRECIO DECIMAL(10,2) not NULL,
    STOCK integer,
    CATEGORIA integer NOT NULL,
    DISPONIBLE boolean not NULL,
    PHOTO bytea,
    DESCRIPCION character varying(1000),
    ID_FABRICANTE integer NOT NULL,
    CONSTRAINT producto_pkey PRIMARY KEY(ID),
    CONSTRAINT producto_fkey FOREIGN KEY (ID_FABRICANTE) REFERENCES USUARIOS(ID) MATCH SIMPLE
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);
