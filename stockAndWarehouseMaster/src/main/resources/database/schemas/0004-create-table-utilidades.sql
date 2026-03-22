--liquibase formatted sql
--changeset stockAndWarehouseMaster tfgAlberto:tabla_utilidades

CREATE SEQUENCE seq_utilidades
    START 1
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9999
    CACHE 1;

CREATE TABLE UTILIDADES (
    ID numeric (4,0) NOT NULL DEFAULT nextval ('seq_utilidades'::regclass),
    RESUMEN character varying(150) NOT NULL,
    TIPO_ESTADO numeric (4,0) NOT NULL,
    CONSTRAINT utilidades_tipos_pkey PRIMARY KEY(ID),
    CONSTRAINT usuarios_tipo_estados_fkey FOREIGN KEY (TIPO_ESTADO) REFERENCES TIPO_ESTADOS(ID) MATCH SIMPLE
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);