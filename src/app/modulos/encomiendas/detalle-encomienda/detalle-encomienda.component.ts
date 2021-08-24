import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'app-detalle-encomienda',
	templateUrl: './detalle-encomienda.component.html',
	styleUrls: ['./detalle-encomienda.component.scss'],
})
export class DetalleEncomiendaComponent implements OnInit {

	columnas: Array<{ titulo: string, valor: string, type: any }> = [{
		titulo: 'Nombre ', valor: 'Nombre', type: 'string'
	}, {
		titulo: 'Documento ', valor: 'Documento', type: 'string'
	}, {
		titulo: 'Fecha Recibido ', valor: 'FechaRecibido', type: 'string'
	}, {
		titulo: 'Vivienda ', valor: 'Vivienda', type: 'string'
	}, {
		titulo: 'Observación ', valor: 'Observacion', type: 'string'
	}, {
		titulo: 'Portero ', valor: 'Portero', type: 'string'
	}];
	@Input() datos: Object = {};

	constructor(
		private modalController: ModalController,
	) { }

	ngOnInit() { }

	cerrarModal() {
		this.modalController.dismiss();
	}

}
