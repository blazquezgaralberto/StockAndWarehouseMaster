--liquibase formatted sql
--changeset stockAndWarehouseMaster tfgAlberto:tabla_tipo_estados

CREATE SEQUENCE seq_tipo_estados
    START 1
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9999
    CACHE 1;

CREATE TABLE TIPO_ESTADOS (
    ID numeric (4,0) NOT NULL DEFAULT nextval ('seq_tipo_estados'::regclass),
    NOMBRE_DESCRIPCION character varying(80) NOT NULL,
    CONSTRAINT tipo_estados_pkey PRIMARY KEY(ID)
);