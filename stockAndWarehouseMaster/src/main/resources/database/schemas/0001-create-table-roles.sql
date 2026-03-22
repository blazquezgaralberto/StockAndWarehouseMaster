--liquibase formatted sql
--changeset stockAndWarehouseMaster tfgAlberto:tabla_roles

CREATE SEQUENCE seq_roles
    START 1
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9999
    CACHE 1;

CREATE TABLE ROLES (
    ID numeric (4,0) DEFAULT nextval ('seq_roles'::regclass),
    NAME character varying(80),
    CONSTRAINT tipo_roles_pkey PRIMARY KEY(ID)
);