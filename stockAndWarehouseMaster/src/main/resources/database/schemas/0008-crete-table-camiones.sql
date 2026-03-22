--liquibase formatted sql
--changeset stockAndWarehouseMaster tfgAlberto:tabla_camiones

CREATE SEQUENCE seq_camiones
    START 1
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9999
    CACHE 1;

CREATE TABLE CAMIONES (
    ID numeric (4,0) NOT NULL DEFAULT nextval ('seq_camiones'::regclass),
    MATRICULA character varying(80) NOT NULL,
    MARCA character varying(80) NOT NULL,
    CAPACIDAD_CARGA float not NULL,
    ESTADO integer NOT NULL,
    CONSTRAINT camiones_pkey PRIMARY KEY(ID)
);
