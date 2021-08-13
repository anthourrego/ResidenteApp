import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { MiVehiculoService } from 'src/app/servicios/mi-vehiculo.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { StorageService } from 'src/app/servicios/storage.service';
import { AgregarVehiculoComponent } from './agregar-vehiculo/agregar-vehiculo.component';

@Component({
	selector: 'app-mis-vehiculos',
	templateUrl: './mis-vehiculos.page.html',
	styleUrls: ['./mis-vehiculos.page.scss'],
})
export class MisVehiculosPage implements OnInit {

	vehiculos: Array<object> = [];
	rutaGeneral: string = 'Propietario/TerceroVehiculo/cTerceroVehiculo/';
	searching: boolean = true;
	buscarLista: string = '';

	constructor(
		private modalController: ModalController,
		private miVehiculoService: MiVehiculoService,
		private storage: StorageService,
		private notificaciones: NotificacionesService
	) { }

	ngOnInit() {
		this.obtenerVehiculos();
	}

	async formularioVehiculo(datosForm?, accion = 'guardar') {
		let componentProps = { datosForm, accion };
		const modal = await this.modalController.create({
			component: AgregarVehiculoComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps
		});
		await modal.present();
		modal.onWillDismiss().then(({ data }) => {
			if (data == 'listar') {
				this.obtenerVehiculos();
			}
		}, console.error);
	}

	async obtenerVehiculos(event?) {
		this.searching = true;
		let Tercero = await this.storage.get('nroDocumento');
		this.miVehiculoService.informacion({ Tercero }, this.rutaGeneral + 'obtenerVehiculos').then(({ success, datos, msg }) => {
			if (success) {
				this.vehiculos = datos;
			} else {
				this.notificaciones.notificacion(msg);
			}
			this.searching = false;
			if (event) {
				event.target.complete();
			}
		}, console.error);
	}

	accionVehiculo(tipo: string, idVehiculo: number, placa?: string) {
		this.searching = true;
		switch (tipo) {
			case 'visualizar':
			case 'modificar':
				this.miVehiculoService.informacion({ idVehiculo }, this.rutaGeneral + 'obtenerVehiculo').then(({ success, datos }) => {
					if (success) {
						this.formularioVehiculo(datos, tipo);
					}
					this.searching = false;
				}, console.error);
				break;
			case 'eliminar':
				this.notificaciones.alerta("¿Desea eliminar el vehiculo con placa " + placa + "?").then(({ role, data }) => {
					if (role == 'aceptar') {
						this.miVehiculoService.informacion({ idVehiculo }, this.rutaGeneral + 'eliminarVehiculo').then(({ success, datos }) => {
							if (success) {
								this.obtenerVehiculos();
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

	slidingVehiculo(ref) {
		let elem: any = document.getElementById(ref);
		(elem as IonItemSliding).getSlidingRatio().then(numero => {
			if (numero === 1) {
				(elem as IonItemSliding).close();
			} else {
				(elem as IonItemSliding).open("end");
			}
		});
	}

	buscarFiltro(evento) {
		this.buscarLista = evento.detail.value;
	}

}
