import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RxFormGroup } from '@rxweb/reactive-form-validators';
import * as moment from 'moment';
import { FuncionesGenerales } from 'src/app/config/funciones/funciones';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { VisitanteService } from 'src/app/servicios/visitante.service';

@Component({
	selector: 'app-agregar-invitacion',
	templateUrl: './agregar-invitacion.component.html',
	styleUrls: ['./agregar-invitacion.component.scss'],
})
export class AgregarInvitacionComponent implements OnInit {

	@Input() datosForm: object;
	@Input() accion: string;
	@Input() vivienda: number;
	datosFormulario: { formulario: RxFormGroup, propiedades: Array<string> };
	rutaGeneral: string = 'Propietario/ProgramarInvitacion/cProgramarInvitacion/';
	tipoVehiculos: Array<object> = [];
	extBase64: string = 'data:image/jpg;base64,';
	imagenGuardar: boolean = false;
	minimoFecha = moment().format('YYYY-MM-DD');

	constructor(
		private modalController: ModalController,
		private visitanteService: VisitanteService,
		private notifcaciones: NotificacionesService,
	) { }

	ngOnInit() {
		this.configForm();
		this.obtenerTipoVehiculos();
	}

	obtenerTipoVehiculos() {
		this.visitanteService.informacion({}, this.rutaGeneral + 'tipoVehiculos').then(({ success, datos }) => {
			if (success) {
				this.tipoVehiculos = datos;
				if (this.datosForm) {
					this.datosFormulario.formulario.patchModelValue(this.datosForm);
					if (this.accion == 'visualizar') {
						this.datosFormulario.formulario.disable();
					}
				}
			}
		}, console.log);
	}

	configForm() {
		this.datosFormulario = FuncionesGenerales.crearFormulario(this.visitanteService);
		this.datosFormulario.propiedades = this.datosFormulario.propiedades.filter(x => x != 'Estado' && x != 'Tipo');
	}

	cerrarModal(accion?) {
		this.datosFormulario.formulario.reset();
		this.modalController.dismiss(accion);
	}

	guardarVisitante() {
		if (this.datosFormulario.formulario.valid) {
			const informacion = Object.assign({}, this.datosFormulario.formulario.value);
			informacion['ViviendaId'] = this.vivienda;
			informacion['Tipo'] = 'P';
			this.visitanteService.informacion(informacion, this.rutaGeneral + 'guardarDatos').then(({ msg, success }) => {
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
