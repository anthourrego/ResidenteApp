import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RxFormGroup } from '@rxweb/reactive-form-validators';
import { FuncionesGenerales } from 'src/app/config/funciones/funciones';
import { MiVehiculoService } from 'src/app/servicios/mi-vehiculo.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { StorageService } from 'src/app/servicios/storage.service';

@Component({
	selector: 'app-agregar-vehiculo',
	templateUrl: './agregar-vehiculo.component.html',
	styleUrls: ['./agregar-vehiculo.component.scss'],
})
export class AgregarVehiculoComponent implements OnInit {

	@Input() datosForm: object;
	@Input() accion: string;
	datosFormulario: { formulario: RxFormGroup, propiedades: Array<string> };
	rutaGeneral: string = 'Propietario/TerceroVehiculo/cTerceroVehiculo/';
	tipoVehiculos: Array<object> = [];

	constructor(
		private modalController: ModalController,
		private miVehiculoService: MiVehiculoService,
		private notifcaciones: NotificacionesService,
		private storage: StorageService
	) {
	}

	ngOnInit() {
		this.configForm();
		this.obtenerTipoVehiculos();
	}

	obtenerTipoVehiculos() {
		this.miVehiculoService.informacion({}, this.rutaGeneral + 'tipoVehiculos').then(({ success, datos, msg }) => {
			if (success) {
				this.tipoVehiculos = datos;
				if (this.datosForm) {
					this.datosFormulario.formulario.patchModelValue(this.datosForm);
					if (this.accion == 'visualizar') {
						this.datosFormulario.formulario.disable();
					}
				}
			} else {
				this.notifcaciones.notificacion(msg);
			}
		}, console.log);
	}

	configForm() {
		this.datosFormulario = FuncionesGenerales.crearFormulario(this.miVehiculoService);
	}

	cerrarModal(accion?) {
		this.datosFormulario.formulario.reset();
		this.modalController.dismiss(accion);
	}

	async guardarVehiculo() {
		if (this.datosFormulario.formulario.valid) {
			const informacion = this.datosFormulario.formulario.value;
			informacion['TerceroID'] = await this.storage.get('nroDocumento');
			this.miVehiculoService.informacion(informacion, this.rutaGeneral + 'guardarDatos').then(({ success, msg }) => {
				if (success) {
					this.cerrarModal('listar');
				} else {
					this.notifcaciones.notificacion(msg);
				}
			}, console.error);
		} else {
			FuncionesGenerales.formularioTocado(this.datosFormulario.formulario);
		}
	}

}
