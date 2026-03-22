import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Almacen } from '../model/almacen';
import { AlmacenService } from '../service/almacen.service';
import { ToastrService } from 'ngx-toastr';
import { AlmacenDetailComponent } from '../../utils/almacen-detail/almacen-detail.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html'
})
export class AlmacenesComponent implements OnInit,AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.cargarPaginacion());
  }
  
  almacenes: Almacen[] = [];
  pagedAlmacenes: Almacen[] = [];
  pageSize = 8;

  modalReference!: NgbModalRef;

  constructor(
    private readonly modalService: NgbModal,
    private readonly route: ActivatedRoute,
    private service: AlmacenService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.cargarAlamacenes();
  }

  cargarAlamacenes(): void {
    this.service.listaTodos().subscribe((response) => {
      if (response) {
        this.almacenes = response;
        this.cargarPaginacion()
      }
    });
  }

  crearAlmacen(): void {
    this.toastr.info('El almacén debe ser creado desde un usuario registrado', 'INFO.', {
      timeOut: 3000, positionClass: 'toast-top-center',
    });
  }

  async editarAlmacen(almacenLista: Almacen): Promise<void> {
    this.modalReference = this.modalService.open(AlmacenDetailComponent, {
      ariaLabelledBy: 'Detalle almacen',
      backdrop: 'static',
      centered: true,
      keyboard: true,
      size: 'lg',
      scrollable: true,
      windowClass: 'custom-modal',
    });

    (this.modalReference.componentInstance as AlmacenDetailComponent).almacenUpdate = almacenLista;
    try {
      const guardarAlmacen = await this.modalReference.result as Almacen;
      if (guardarAlmacen) {
        this.service.insertAlmacen(guardarAlmacen).subscribe((response) => {
          if (response) {
            this.cargarAlamacenes();
          }
        });
      }
    } catch (rejectedPromise) {
    }
  }


  toggleAlmacen(almacen: any) {
    almacen.activo = !almacen.activo;
    if (almacen.activo) {
      this.habilitarInhabilitar(almacen);
    } else {
      this.habilitarInhabilitar(almacen);
    }
  }

  habilitarInhabilitar(almacen: Almacen) {
    this.service.insertAlmacen(almacen).subscribe((response) => {
      if (response) {
        this.cargarAlamacenes();
      }
    });
  }

  cargarPaginacion(): void {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.pagedAlmacenes = this.almacenes.slice(startIndex, endIndex);
    }
  }

}
