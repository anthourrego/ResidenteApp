import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RxFormGroup } from '@rxweb/reactive-form-validators';
import * as moment from 'moment';
import { FuncionesGenerales } from 'src/app/config/funciones/funciones';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { VacunasService } from 'src/app/servicios/vacunas.service';

@Component({
  	selector: 'app-agregar-vacuna',
  	templateUrl: './agregar-vacuna.component.html',
  	styleUrls: ['./agregar-vacuna.component.scss'],
})
export class AgregarVacunaComponent implements OnInit {

	@Input() Mascota: string;
	@Input() accion: string;

	datosFormulario: { formulario: RxFormGroup, propiedades: Array<string> };
	maximoFecha = moment().format('YYYY-MM-DD');
	searching: boolean = false;
	rutaGeneral: string = 'Propietario/Mascota/cMascota/';

  	constructor(
		private modalController: ModalController,
		private serviceVacuna: VacunasService,
		private notificaciones: NotificacionesService,
	) { }

  	ngOnInit() {
		this.configForm();
	}

	configForm() {
		this.datosFormulario = FuncionesGenerales.crearFormulario(this.serviceVacuna);
		this.datosFormulario.formulario.get('Mascota').setValue(this.Mascota['nombre']);
		this.datosFormulario.formulario.get('Mascota').disable()
	}

	cerrarModal(accion?) {
		this.datosFormulario.formulario.reset();
		this.modalController.dismiss(accion);
	}

	async guardarVacuna() {
		this.searching = true;
		if (this.datosFormulario.formulario.valid) {
			const informacion = Object.assign({}, this.datosFormulario.formulario.value);
			informacion['TerceroMascotaId'] = this.Mascota['id'];
			informacion['Mascota'] = this.Mascota['nombre'];
			await this.serviceVacuna.informacion(informacion, this.rutaGeneral + 'guardarVacuna').then(resp => {
				if (resp.success) {
					this.cerrarModal('listar');
					this.notificaciones.notificacion(resp.msg);
				} else {
					this.notificaciones.notificacion(resp.msg);
				}
			}, console.error);
		} else {
			FuncionesGenerales.formularioTocado(this.datosFormulario.formulario);
		}
		this.searching = false;
	}

}
