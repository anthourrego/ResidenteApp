import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../servicios/servicios.service';
import { NotificacionesService } from '../../servicios/notificaciones.service';
import { IonItemSliding } from '@ionic/angular';
import * as moment from 'moment';

@Component({
	selector: 'app-servicios',
	templateUrl: './servicios.page.html',
	styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

	rutaGeneral: string = 'Propietario/Servicios/cServicios/';
	searching: boolean = false;
	segmento: string = 'pendientes';
	servicios: Array<object> = [];
	historico: Array<object> = [];
	viviendaTercero: number = -1;
	buscarLista: string = '';
	buscarListaHistorico: string = '';

	constructor(
		private serviciosService: ServiciosService,
		private notificacionesService: NotificacionesService
	) { }

	ngOnInit() {
		this.obtenerInformacion('ServicioPendientes', 'dataServicios');
	}

	cambioSegmento(evento?) {
		this.segmento = evento.detail.value;
		if (this.viviendaTercero != -1) {
			if (this.segmento == 'historico') {
				this.historico = [];
				let datos = { vivienda: this.viviendaTercero };
				this.obtenerInformacion('obtenerHistorico', 'infoHistorico', datos);
			} else {
				this.servicios = [];
				this.obtenerInformacion('ServicioPendientes', 'dataServicios');
			}
		} else {
			this.notificacionesService.notificacion("No tiene vivienda asignada.");
		}
	}

	buscarFiltro(variable, evento) {
		this[variable] = evento.detail.value;
	}

	obtenerInformacion(metodo, funcion, datos = {}, event?) {
		this.searching = true;
		this.serviciosService.informacion(datos, this.rutaGeneral + metodo).then(resp => {
			if (resp.vivienda) {
				this.viviendaTercero = resp.vivienda;
			}
			if (resp.success) {
				this[funcion](resp);
			} else {
				if (metodo == 'recibirServicio') {
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

	dataServicios({ datos }) {
		datos = datos.map(it => {
			it.Fecha = moment((it.FechaRecibido ? it.FechaRecibido : it.FechaRegis)).format('DD/MM/YYYY');
			return it;
		});
		this.servicios = datos;
	}

	infoHistorico({ datos }) {
		datos = datos.map(it => {
			it.Fecha = moment((it.FechaRecibido ? it.FechaRecibido : it.FechaRegis)).format('DD/MM/YYYY');
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

	accionServicio(tipo: string, datos: any) {
		let info = { id: datos.Id };
		switch (tipo) {
			case 'recibido':
				this.notificacionesService.alerta("¿Confirmar el recibido del servicio de " + datos.NomSer + "?").then(({ role }) => {
					if (role == 'aceptar') {
						this.searching = true;
						this.obtenerInformacion('recibirServicio', 'servicioRecibido', info);
					}
				});
				break;
			default:
				console.log("EL valor no es valido");
				break;
		}
	}

	servicioRecibido() {
		this.servicios = [];
		this.obtenerInformacion('ServicioPendientes', 'dataServicios');
	}

	refresh(event) {
		if (this.viviendaTercero != -1) {
			this.historico = [];
			let datos = { vivienda: this.viviendaTercero };
			this.obtenerInformacion('obtenerHistorico', 'infoHistorico', datos, event);
		} else {
			this.notificacionesService.notificacion("No tiene vivienda asignada.");
			event.target.complete();
		}
	}

}
