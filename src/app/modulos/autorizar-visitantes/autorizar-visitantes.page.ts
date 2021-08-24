import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { StorageService } from 'src/app/servicios/storage.service';
import { VisitanteService } from 'src/app/servicios/visitante.service';
import { AgregarVisitanteComponent } from './agregar-visitante/agregar-visitante.component';
import * as moment from 'moment';

@Component({
	selector: 'app-autorizar-visitantes',
	templateUrl: './autorizar-visitantes.page.html',
	styleUrls: ['./autorizar-visitantes.page.scss'],
})
export class AutorizarVisitantesPage implements OnInit {

	visitantes: Array<object> = [];
	rutaGeneral: string = 'Propietario/AutorizarVisitante/cAutorizarVisitante/';
	searching: boolean = true;
	viviendaTercero: number = -1;
	buscarLista: string = '';

	constructor(
		private modalController: ModalController,
		private visitanteService: VisitanteService,
		private storage: StorageService,
		private notificaciones: NotificacionesService
	) { }

	ngOnInit() {
		this.obtenerVisitantes();
	}

	async formularioVisitante(datosForm?, accion = 'guardar', idEditar?) {
		let componentProps = { datosForm, accion, vivienda: this.viviendaTercero, idEditar };
		const modal = await this.modalController.create({
			component: AgregarVisitanteComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps
		});
		await modal.present();
		modal.onWillDismiss().then(({ data }) => {
			if (data == 'listar') {
				this.obtenerVisitantes();
			}
		}, console.error);
	}

	async obtenerVisitantes(event?) {
		this.searching = true;
		let Tercero = await this.storage.get('nroDocumento');
		this.visitanteService.informacion({ Tercero }, this.rutaGeneral + 'obtenerVisitantes').then(({ success, msg, vivienda, datos }) => {
			if (success) {
				datos = datos.map(it => {
					it.Fecha = moment(it.FechaRegis).format('DD/MM/YYYY');
					return it;
				})
				this.visitantes = datos;
				this.viviendaTercero = vivienda;
			} else {
				this.viviendaTercero = vivienda ? vivienda : -1;
				this.visitantes = [];
				//this.notificaciones.notificacion(msg);
			}
			this.searching = false;
			if (event) {
				event.target.complete();
			}
		}, console.error);
	}

	accionVisitante(tipo: string, ProgIngresoId: number, nombre?: string) {
		this.searching = true;
		switch (tipo) {
			case 'visualizar':
			case 'modificar':
				this.visitanteService.informacion({ ProgIngresoId }, this.rutaGeneral + 'obtenerVisitante').then(({ success, datos }) => {
					if (success) {
						this.formularioVisitante(datos, tipo, ProgIngresoId);
					}
					this.searching = false;
				}, console.error);
				break;
			case 'eliminar':
				this.notificaciones.alerta("¿Desea eliminar a " + nombre + "?").then(({ role, data }) => {
					if (role == 'aceptar') {
						this.visitanteService.informacion({ ProgIngresoId }, this.rutaGeneral + 'eliminarAutorizacion').then(({ success, datos }) => {
							if (success) {
								this.obtenerVisitantes();
							}
							this.searching = false;
						}, console.error);
					} else {
						this.searching = false;
					}
				});
				break;
			default:
				console.log("EL valor no es valido");
				break;
		}
	}

	slidingVisitante(ref) {
		let elem: any = document.getElementById(ref);
		(elem as IonItemSliding).getSlidingRatio().then(numero => {
			if (numero === 1) {
				(elem as IonItemSliding).close();
			} else {
				(elem as IonItemSliding).open("end");
			}
		});
	}

	buscarFiltro(variable, evento) {
		this[variable] = evento.detail.value;
	}
}
