import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { VisitanteService } from '../../servicios/visitante.service';
import { AgregarInvitacionComponent } from './agregar-invitacion/agregar-invitacion.component';
import * as moment from 'moment';
import { DetalleHistoricoComponent } from './detalle-historico/detalle-historico.component';

@Component({
	selector: 'app-programar-invitaciones',
	templateUrl: './programar-invitaciones.page.html',
	styleUrls: ['./programar-invitaciones.page.scss'],
})
export class ProgramarInvitacionesPage implements OnInit {

	rutaGeneral: string = 'Propietario/ProgramarInvitacion/cProgramarInvitacion/';
	searching: boolean = false;
	segmento: string = 'pendientes';
	historico: Array<object> = [];
	invitados: Array<object> = [];
	viviendaTercero: number = -1;
	buscarLista: string = '';
	buscarListaHistorico: string = '';


	constructor(
		private modalController: ModalController,
		private notificaciones: NotificacionesService,
		private visitanteService: VisitanteService
	) { }

	ngOnInit() {
		this.obtenerInformacion('obtenerInvitaciones', 'invitaciones');
	}

	cambioSegmento(ev: any) {
		this.segmento = ev.detail.value;
		if (this.segmento == 'historico') {
			this.obtenerInformacion('obtenerHistoricos', 'infoHistorico');
		}
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

	accionProgramar(tipo: string, datos: any) {
		let info = { ProgIngresoId: datos.ProgIngresoId };
		switch (tipo) {
			case 'visualizar':
				this.visitanteService.informacion(info, this.rutaGeneral + 'obtenerProgramacion').then(({ success, datos }) => {
					if (success) {
						this.formProgramar(datos, tipo);
					}
					this.searching = false;
				}, console.error);
				break;
			case 'eliminar':
				this.notificaciones.alerta("¿Desea eliminar la invitación a " + datos.Nombre + "?").then(({ role }) => {
					if (role == 'aceptar') {
						this.searching = true;
						this.visitanteService.informacion(info, this.rutaGeneral + 'eliminarProgramacion').then(({ success, msg }) => {
							this.notificaciones.notificacion(msg);
							if (success) {
								this.obtenerInformacion('obtenerInvitaciones', 'invitaciones');
							} else {
								this.searching = false;
							}
						}, console.error);
					}
				});
				break;
			default:
				console.log("EL valor no es valido");
				break;
		}
	}

	async formProgramar(datosForm?, accion = "crear") {
		let componentProps = { datosForm, accion, vivienda: this.viviendaTercero };
		const modal = await this.modalController.create({
			component: AgregarInvitacionComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps
		});
		await modal.present();
		modal.onWillDismiss().then(({ data }) => {
			if (data == 'listar') {
				this.obtenerInformacion('obtenerInvitaciones', 'invitaciones');
			}
		}, console.error);
	}

	obtenerInformacion(metodo, funcion, datos = {}, event?) {
		this.searching = true;
		this.visitanteService.informacion(datos, this.rutaGeneral + metodo).then(resp => {
			this[funcion](resp);
			this.searching = false;
			if (event){
				event.target.complete();
			}
		}, console.error);
	}

	invitaciones({ success, msg, vivienda, datos }) {
		if (success) {
			datos = datos.map(it => {
				it.Fecha = moment(it.FechaInvi).format('DD/MM/YYYY');
				return it;
			});
			this.invitados = datos;
			this.viviendaTercero = vivienda;
		} else {
			this.viviendaTercero = -1;
			this.notificaciones.notificacion(msg);
		}
	}

	infoHistorico({ success, msg, datos }) {
		if (success) {
			datos = datos.map(it => {
				it.Fecha = moment(it.FechaInvi).format('DD/MM/YYYY');
				return it;
			});
			this.historico = datos;
		} else {
			this.notificaciones.notificacion(msg);
		}
	}

	verHistorico(ProgIngresoId) {
		this.visitanteService.informacion({ ProgIngresoId }, this.rutaGeneral + 'obtenerHistorico').then(async ({ success, datos }) => {
			if (success) {
				const modal = await this.modalController.create({
					component: DetalleHistoricoComponent,
					backdropDismiss: true,
					cssClass: 'animate__animated animate__slideInRight animate__faster',
					componentProps: { datos }
				});
				await modal.present();
				modal.onWillDismiss().then(console.log, console.error);
			}
			this.searching = false;
		}, console.error);
	}

	buscarFiltro(variable, evento) {
		this[variable] = evento.detail.value;
	}

}
