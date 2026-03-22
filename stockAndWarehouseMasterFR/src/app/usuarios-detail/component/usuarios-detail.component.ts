import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ConfirmacionesModalComponent } from '../../utils/confirmaciones-modal/confirmaciones-modal.component';
import { UsuariosDetailsService } from '../service/usuarios-detail.service';
import { Role, Usuario } from '../../users/model/usuario';
import { ToastrService } from 'ngx-toastr';
import { AlmacenService } from '../../almacen/service/almacen.service';
import { Almacen } from '../../almacen/model/almacen';
import { AlmacenDetailComponent } from '../../utils/almacen-detail/almacen-detail.component';
import { MatPaginator } from '@angular/material/paginator';
import { ProfileDetailModalComponent } from '../../utils/profile-detail/profile-detail.component';

@Component({
  selector: 'app-usuarios-details',
  templateUrl: './usuarios-detail.component.html'
})
export class UsuariosDetailComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.cargarPaginacion());
  }

  usuarios: Usuario[] = [];
  pagedUsuarios: Usuario[] = [];
  pageSize = 5;

  almacenes: Almacen[] = [];

  modalReference!: NgbModalRef;

  comboRoles = this.route.snapshot.data['comboRoles'];
  rolesSeleccionados: { [key: number]: Role[] } = {};

  constructor(
    private readonly modalService: NgbModal,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService,
    private service: UsuariosDetailsService,
    private almacenService: AlmacenService,
  ) {
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.service.lista().subscribe((response) => {
      if (response) {
        this.usuarios = response;
        this.usuarios.forEach(usuario => {
          this.rolesSeleccionados[usuario.id] = usuario.roles;
          this.cargarPaginacion();
        });
      }
    });

  }

  cargarPaginacion(): void {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.pagedUsuarios = this.usuarios.slice(startIndex, endIndex);
    }
  }

  async editar(usuario: Usuario): Promise<void> {
    this.modalReference = this.modalService.open(ProfileDetailModalComponent, {
      ariaLabelledBy: 'Detalle productos',
      backdrop: 'static',
      centered: true,
      keyboard: true,
      size: 'lg',
      scrollable: true,
      windowClass: 'custom-modal',
    });

    (this.modalReference.componentInstance as ProfileDetailModalComponent).username = usuario.username;

    try {
      const result = await this.modalReference.result;
      if (result) {
        this.toastr.success('Usuario actualizado correctamente', 'ACCIÓN COMPLETADA CORRECAMENTE', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.cargarUsuarios();
      }

    } catch (rejectedPromise) {
    }
  }

  async borrar(usuarioAEliminar: Usuario): Promise<void> {
    this.modalReference = this.modalService.open(ConfirmacionesModalComponent, {
      ariaLabelledBy: 'Eliminar usuario',
      backdrop: 'static',
      centered: true,
      keyboard: true,
      size: 'lg',
      scrollable: true,
      windowClass: 'custom-modal',
    });

    try {
      const result = await this.modalReference.result;
      if (result) {
        this.service.delete(usuarioAEliminar).subscribe(() => {
          this.cargarUsuarios();
        });
      }
    } catch (rejectedPromise) {
    }
  }


  async guardarRolUsuario(usuario: Usuario, rolesComboSelect: Role[]): Promise<void> {
    let hayAlmacen = false;

    if (rolesComboSelect.length === 0) {
      this.toastr.error('No puede dejar vacíos los roles del usuario', 'Fail', {
        timeOut: 3000, positionClass: 'toast-top-center',
      });
    } else {

      rolesComboSelect.forEach(rol => {
        if (rol.name === 'ROLE_ALMACEN') {
          hayAlmacen = true;
        }
      });

      if (hayAlmacen) {

        const response = this.comprobarAlmacenes(usuario);
        if (await response) {
          usuario.roles = rolesComboSelect;
          this.insertarRoles(usuario);
        } else {
          this.pedirUbicacionAlmacen(usuario, rolesComboSelect)
        }

      } else {
        usuario.roles = rolesComboSelect;
        this.insertarRoles(usuario);
      }

    }
  }

  insertarRoles(usuario: Usuario) {
    this.service.insertRoles(usuario).subscribe(() => {
      this.cargarUsuarios();
    });
  }

  async comprobarAlmacenes(usuario: Usuario): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let almacenCreado = false;
      this.almacenService.lista().subscribe((response) => {
        if (response) {
          this.almacenes = response;
          this.almacenes.forEach(a => {
            if (a.userId === usuario.id) {
              almacenCreado = true;
            }
          });
        }
        resolve(almacenCreado);
      });
    });
  }

  async pedirUbicacionAlmacen(usuario: Usuario, rolesComboSelect: Role[]): Promise<void> {
    this.modalReference = this.modalService.open(AlmacenDetailComponent, {
      ariaLabelledBy: 'Ubicación nuevo almacén',
      backdrop: 'static',
      centered: true,
      keyboard: true,
      size: 'lg',
      scrollable: true,
      windowClass: 'custom-modal',
    });

    (this.modalReference.componentInstance as AlmacenDetailComponent).usuario = usuario;
    try {
      const usuarioConUbicacion = await this.modalReference.result;
      if (usuario) {
        usuario = usuarioConUbicacion;
        usuario.roles = rolesComboSelect;
        this.insertarRoles(usuario);
      }

    } catch (rejectedPromise) {
    }
  }
}
