import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RxFormGroup } from '@rxweb/reactive-form-validators';
import { FuncionesGenerales } from 'src/app/config/funciones/funciones';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { StorageService } from 'src/app/servicios/storage.service';
import { VisitanteService } from 'src/app/servicios/visitante.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
	selector: 'app-agregar-visitante',
	templateUrl: './agregar-visitante.component.html',
	styleUrls: ['./agregar-visitante.component.scss'],
})
export class AgregarVisitanteComponent implements OnInit {

	@Input() datosForm: object;
	@Input() accion: string;
	@Input() vivienda: number;
	@Input() idEditar: number;
	datosFormulario: { formulario: RxFormGroup, propiedades: Array<string> };
	rutaGeneral: string = 'Propietario/AutorizarVisitante/cAutorizarVisitante/';
	tipoVehiculos: Array<object> = [];
	// Opciones de la camara
	opcionescamara: CameraOptions = {
		quality: 100, // De 0 a 100
		destinationType: this.camera.DestinationType.DATA_URL,
		encodingType: this.camera.EncodingType.JPEG,
		mediaType: this.camera.MediaType.PICTURE,
		allowEdit: false,
		correctOrientation: true
	};
	// Opciones de la galeria
	opcionesgaleria: CameraOptions = {
		quality: 100, // De 0 a 100
		sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
		destinationType: this.camera.DestinationType.DATA_URL,
		allowEdit: false,
		correctOrientation: true
	};
	fotoVisitante: string;
	extBase64: string = 'data:image/jpg;base64,';
	imagenGuardar: boolean = false;

	constructor(
		private modalController: ModalController,
		private visitanteService: VisitanteService,
		private notifcaciones: NotificacionesService,
		private storage: StorageService,
		private camera: Camera,
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
					if (this.datosForm['Foto']) {
						this.fotoVisitante = this.datosForm['Foto'];
					}
				}
			}
		}, console.log);
	}

	configForm() {
		this.datosFormulario = FuncionesGenerales.crearFormulario(this.visitanteService);
		this.datosFormulario.propiedades = this.datosFormulario.propiedades.filter(x => x != 'Estado' && x != 'Tipo' && x != 'Fecha');

		this.datosFormulario.formulario.removeControl("Fecha");
	}

	cerrarModal(accion?) {
		this.datosFormulario.formulario.reset();
		this.modalController.dismiss(accion);
	}

	async guardarVisitante() {
		if (this.datosFormulario.formulario.valid) {
			const informacion = Object.assign({}, this.datosFormulario.formulario.value);
			informacion['TerceroID'] = await this.storage.get('nroDocumento');
			informacion['Foto'] = this.fotoVisitante ? this.fotoVisitante : '';
			informacion['ViviendaId'] = this.vivienda;
			informacion['GID'] = (this.idEditar ? this.idEditar : '');
			delete informacion.Fecha;
			if (this.accion == 'modificar') {
				informacion['editar'] = true;
			}
			if (!this.imagenGuardar && this.idEditar) {
				delete informacion.Foto;
			}
			this.visitanteService.informacion(informacion, this.rutaGeneral + 'guardarDatos').then(({ msg, success }) => {
				if (success) {
					this.fotoVisitante = null;
					this.cerrarModal('listar');
				} else {
					this.notifcaciones.notificacion(msg);
				}
			}, console.error);
		} else {
			/* if (!this.fotoVisitante) {
				this.notifcaciones.notificacion("No has selecciondo foto de la persona");
			} */
			FuncionesGenerales.formularioTocado(this.datosFormulario.formulario);
		}
	}

	obtenerFotoPerfil() {
		const botones = [{
			text: 'Camara',
			role: 'camara'
		}, {
			text: 'Galeria',
			role: 'galeria'
		}, {
			text: 'Cancelar',
			role: 'cancelar'
		}];
		this.notifcaciones.alerta("Seleccionemos tu foto de perfil", botones).then(({ role }) => {
			if (role == 'camara' || role == 'galeria') {
				this.camera.getPicture(this['opciones' + role]).then((imageData) => {
					this.fotoVisitante = imageData;
					this.imagenGuardar = true;
				}, (err) => {
					if (err != "No Image Selected") {
						this.fotoVisitante = null;
						this.imagenGuardar = false;
						this.notifcaciones.notificacion("Error al tomar imagen.");
					}
				});
			}
		}, console.error);
	}

}
