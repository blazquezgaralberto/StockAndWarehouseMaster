--liquibase formatted sql
--changeset stockAndWarehouseMaster tfgAlberto:valores_roles

INSERT INTO ROLES values(1, 'ROLE_USER');
INSERT INTO ROLES values(2, 'ROLE_ADMIN');
INSERT INTO ROLES values(3, 'ROLE_FABRICANTE');
INSERT INTO ROLES values(4, 'ROLE_ALMACEN');