import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-confirmaciones-detail',
    templateUrl: './confirmaciones-modal.component.html'
})
export class ConfirmacionesModalComponent{

    constructor(
        public activeModal: NgbActiveModal
    ) {}

    cancel(){
        this.activeModal.close();
    }
    eliminar(){
        this.activeModal.close(true);
    }
}
