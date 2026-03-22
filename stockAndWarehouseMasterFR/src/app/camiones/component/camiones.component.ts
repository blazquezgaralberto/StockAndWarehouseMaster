import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Camion } from '../model/camion';
import { CamionesService } from '../service/camiones.service';
import { CamionDetailComponent } from '../../utils/camion-detail/camion-detail.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmacionesModalComponent } from '../../utils/confirmaciones-modal/confirmaciones-modal.component';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-camiones',
  templateUrl: './camiones.component.html'
})
export class CamionesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.cargarPaginacion());
  }
  
  camiones: Camion[] = [];
  pagedCamiones: Camion[] = [];
  pageSize = 8;

  modalReference!: NgbModalRef;

  desplegableCamiones = this.route.snapshot.data['desplegableCamiones'];

  constructor(
    private readonly modalService: NgbModal,
    private readonly route: ActivatedRoute,
    private service: CamionesService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.cargarCamiones();
  }

  cargarCamiones(): void {
    this.service.lista().subscribe((response) => {
      if (response) {
        this.camiones = response;
        this.cargarEstados();
        this.cargarPaginacion();
      }
    });
    
  }

  cargarEstados():void{
    this.camiones.forEach(c => {
      if (c.estado === 13) {
        c.estadoString = "OCUPADO";
      }else if(c.estado === 12){
        c.estadoString = "LIBRE";
      }
      
    });
  }

  async detalleCamion(camionLista?: Camion): Promise<void> {
    this.modalReference = this.modalService.open(CamionDetailComponent, {
      ariaLabelledBy: 'Detalle productos',
      backdrop: 'static',
      centered: true,
      keyboard: true,
      size: 'lg',
      scrollable: true,
      windowClass: 'custom-modal',
    });

    (this.modalReference.componentInstance as CamionDetailComponent).camion = camionLista || new Camion();
    (this.modalReference.componentInstance as CamionDetailComponent).desplegableCamiones = this.desplegableCamiones;
    try {
      const guardarCamion = await this.modalReference.result;
      if(guardarCamion){
        this.service.insertCamion(guardarCamion).subscribe((response) =>{
          if(response){
            this.toastr.success(response.message, 'ACCIÓN COMPLETADA CORRECAMENTE', {
              timeOut: 3000, positionClass: 'toast-top-center',
            });
            this.cargarCamiones();
          }
          
        });
      }

    } catch (rejectedPromise) {
    }

  }

  async borrar(camionAEliminar: Camion): Promise<void> {
    this.modalReference = this.modalService.open(ConfirmacionesModalComponent, {
      ariaLabelledBy: 'Eliminar camión',
      backdrop: 'static',
      centered: true,
      keyboard: true,
      size: 'lg',
      scrollable: true,
      windowClass: 'custom-modal',
    });

    try {
      const eliminarCamion = await this.modalReference.result;
      if(eliminarCamion){
        this.service.delete(camionAEliminar).subscribe(() => {
          this.cargarCamiones();
        });
      }
    } catch (rejectedPromise) {
    }
  }

  cargarPaginacion(): void {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.pagedCamiones = this.camiones.slice(startIndex, endIndex);
    }
  }
}
