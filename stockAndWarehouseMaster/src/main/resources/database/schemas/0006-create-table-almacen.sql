--liquibase formatted sql
--changeset stockAndWarehouseMaster tfgAlberto:tabla_alamacen

CREATE SEQUENCE seq_almacen
    START 1
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9999
    CACHE 1;

CREATE TABLE ALMACENES (
    ID numeric (4,0) NOT NULL DEFAULT nextval ('seq_almacen'::regclass),
    NOMBRE character varying(80) NOT NULL,
    UBICACION character varying(1000) NOT NULL,
    CONSTRAINT almacen_pkey PRIMARY KEY(ID)
);

--changeset stockAndWarehouseMaster tfgAlberto:columna_activo_almacenes
ALTER TABLE ALMACENES ADD COLUMN ACTIVO boolean default true;
ALTER TABLE ALMACENES ADD COLUMN USER_ID numeric (4,0) NOT NULL;
ALTER TABLE ALMACENES ADD FOREIGN KEY (USER_ID) REFERENCES USUARIOS(ID);