--liquibase formatted sql
--changeset stockAndWarehouseMaster tfgAlberto:tabla_usuarios

CREATE SEQUENCE seq_usuarios
    START 1
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9999
    CACHE 1;

CREATE TABLE USUARIOS (
    ID numeric (4,0) DEFAULT nextval ('seq_usuarios'::regclass),
    NOMBRE character varying(100) NOT NULL,
    USERNAME character varying(20) NOT NULL,
    CONTRASENA character varying(120) NOT NULL,
    EMAIL character varying(50) NOT NULL,
    TELEFONO character varying(50),
    FECHA_ALTA timestamp NOT NULL default now(),
    CONSTRAINT usuarios_pkey PRIMARY KEY(ID)
);

CREATE TABLE ROLES_USUARIO (
    USER_ID numeric (4,0) NOT NULL,
    ROL_ID numeric (4,0) NOT NULL,
    PRIMARY KEY (USER_ID, ROL_ID),
  	FOREIGN KEY (USER_ID) REFERENCES USUARIOS(ID),
  	FOREIGN KEY (ROL_ID) REFERENCES ROLES(ID)
);

--changeset stockAndWarehouseMaster tfgAlberto:columna_activo
ALTER TABLE USUARIOS ADD COLUMN ACTIVO boolean default true;
--changeset stockAndWarehouseMaster tfgAlberto:columna_foto_perfil
ALTER TABLE USUARIOS ADD COLUMN PHOTO bytea;
