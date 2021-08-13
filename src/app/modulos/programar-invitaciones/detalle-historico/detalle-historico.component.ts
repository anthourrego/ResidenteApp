import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'app-detalle-historico',
	templateUrl: './detalle-historico.component.html',
	styleUrls: ['./detalle-historico.component.scss'],
})
export class DetalleHistoricoComponent implements OnInit {

	columnas: Array<{ titulo: string, valor: string, type: any }> = [{
		titulo: 'Cedula ', valor: 'Cedula', type: 'string'
	}, {
		titulo: 'Observacion ', valor: 'Observacion', type: 'string'
	}, {
		titulo: 'Placa ', valor: 'Placa', type: 'string'
	}, {
		titulo: 'Estado', valor: 'Estado', type: 'string'
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
