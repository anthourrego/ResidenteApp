import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { EncomiendasService } from '../../servicios/encomiendas.service';
import { DetalleEncomiendaComponent } from './detalle-encomienda/detalle-encomienda.component';

@Component({
	selector: 'app-encomiendas',
	templateUrl: './encomiendas.page.html',
	styleUrls: ['./encomiendas.page.scss'],
})
export class EncomiendasPage implements OnInit {

	rutaGeneral: string = 'Propietario/Encomiendas/cEncomiendas/';
	searching: boolean = false;
	segmento: string = 'pendientes';
	encomiendas: Array<object> = [];
	historico: Array<object> = [];
	buscarLista: string = '';
	buscarListaHistorico: string = '';

	constructor(
		private encomiendasService: EncomiendasService,
		private notificacionesService: NotificacionesService,
		private modalController: ModalController
	) { }

	ngOnInit() {
		this.obtenerInformacion('EncomiendasPendientes', 'dataEncomiendas');
	}

	cambioSegmento(evento?) {
		this.segmento = evento.detail.value;
		if (this.segmento == 'historico') {
			this.historico = [];
			this.obtenerInformacion('obtenerHistorico', 'infoHistorico');
		} else {
			this.encomiendas = [];
			this.obtenerInformacion('EncomiendasPendientes', 'dataEncomiendas');
		}
	}

	buscarFiltro(variable, evento) {
		this[variable] = evento.detail.value;
	}

	obtenerInformacion(metodo, funcion, datos = {}, event?) {
		this.searching = true;
		this.encomiendasService.informacion(datos, this.rutaGeneral + metodo).then(resp => {
			if (resp.success) {
				this[funcion](resp);
			} else {
				if (metodo == 'recibirEncomienda') {
					this.notificacionesService.notificacion(resp.msg);
				}
			}
			this.searching = false;
			if (event) {
				event.target.complete();
			}
		}, console.error).catch(err => {
			console.log("Error ", err);
			this.searching = false;
		});
	}

	dataEncomiendas({ datos }) {
		datos = datos.map(it => {
			it.Fecha = moment(it.FechaRecibido).format('DD/MM/YYYY');
			return it;
		});
		this.encomiendas = datos;
	}

	infoHistorico({ datos }) {
		datos = datos.map(it => {
			it.Fecha = moment(it.FechaRecibido).format('DD/MM/YYYY');
			return it;
		});
		this.historico = datos;
	}

	sliding(ref) {
		let elem: any = document.getElementById(ref);
		(elem as IonItemSliding).getSlidingRatio().then(numero => {
			if (numero === 1) {
				(elem as IonItemSliding).close();
			} else {
				(elem as IonItemSliding).open("end");
			}
		});
	}

	accionEncomienda(tipo: string, datos: any) {
		let info = { id: datos.Id };
		switch (tipo) {
			case 'recibido':
				this.notificacionesService.alerta("¿Confirmar la encomienda de " + datos.Nombre + "?").then(({ role }) => {
					if (role == 'aceptar') {
						this.searching = true;
						this.obtenerInformacion('recibirEncomienda', 'encomiendaRecibido', info);
					}
				});
				break;
			default:
				console.log("EL valor no es valido");
				break;
		}
	}

	encomiendaRecibido() {
		this.encomiendas = [];
		this.obtenerInformacion('EncomiendasPendientes', 'dataEncomiendas');
	}

	refresh(event) {
		this.historico = [];
		this.obtenerInformacion('obtenerHistorico', 'infoHistorico', {}, event);
	}

	async verDetalleEncomienda(datos) {
		const modal = await this.modalController.create({
			component: DetalleEncomiendaComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps: { datos }
		});
		await modal.present();
		modal.onWillDismiss().then(console.log, console.error);
	}

}
