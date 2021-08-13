import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { async, RxFormGroup } from '@rxweb/reactive-form-validators';
import { FuncionesGenerales } from 'src/app/config/funciones/funciones';
import { MiMascotaService } from 'src/app/servicios/mi-mascota.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { StorageService } from 'src/app/servicios/storage.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
	selector: 'app-agregar-mascota',
	templateUrl: './agregar-mascota.component.html',
	styleUrls: ['./agregar-mascota.component.scss'],
})
export class AgregarMascotaComponent implements OnInit {

	@Input() datos: object;
	@Input() accion: string;
	@Input() tipoMascotas: Array<object>;
	@Input() vivienda: string;
	datosFormulario: { formulario: RxFormGroup, propiedades: Array<string> };
	rutaGeneral: string = 'Propietario/Mascota/cMascota/';
	rutaFoto: string = this.miMascotaService.url;
	maximoFecha = moment().format('YYYY-MM-DD');
	searching: boolean = false;
	imagenGuardar = false;

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
	fotoMascota: string;
	extBase64: string = 'data:image/jpg;base64,';

	constructor(
		private modalController: ModalController,
		private miMascotaService: MiMascotaService,
		private camera: Camera,
		private notifcaciones: NotificacionesService,
		private storage: StorageService
	) {
	}

	ngOnInit() {
		this.configForm();
	}

	cerrarModal(datos?, id?) {
		let data = Array();
		data['tipo'] = datos;
		data['id'] = id;
		this.datosFormulario.formulario.reset();
		this.modalController.dismiss(data);
	}

	configForm() {
		this.datosFormulario = FuncionesGenerales.crearFormulario(this.miMascotaService);
		if (this.datos) {
			this.datosFormulario.formulario.patchModelValue(this.datos);
			this.datosFormulario.formulario.get("Nombre").setValue(this.datos['nombre']);
			this.datosFormulario.formulario.get("Sexo").setValue(this.datos['SexoId']);
			this.fotoMascota = this.rutaFoto + this.datos['Foto'].substr(2);
		}
	}

	async guardarMascota() {
		this.searching = true;
		if (this.datosFormulario.formulario.valid) {
			const informacion = Object.assign({}, this.datosFormulario.formulario.value);

			informacion['Foto'] = this.fotoMascota ? this.fotoMascota : '';

			/* if (this.accion == 'editar' && !this.imagenGuardar) {
				informacion['Foto'] = '';
			} */

			//informacion['Foto'] = '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';

			informacion['TipoMascota'] = this.tipoMascotas.find(element => element['id'] == informacion['TipoMascotaId'])['nombre'];
			informacion['SexoNombre'] = informacion['Sexo'] == 'M' ? 'Macho' : 'Hembra';
			informacion['TerceroID'] = await this.storage.get('nroDocumento');
			informacion['ViviendaId'] = this.vivienda;			
			informacion['GID'] = (this.accion == 'crear' ? "null" : this.datos['id']);
			informacion['FechaNac'] = moment(informacion['FechaNac']).format('YYYY-MM-DD');
			await this.miMascotaService.informacion(informacion, this.rutaGeneral + 'ActualizarImagen').then(resp => {
				if (resp.success) {
					this.cerrarModal('listar', resp.id);
					this.notifcaciones.notificacion(resp.msg);
				} else {
					this.notifcaciones.notificacion(resp.msg);
				}
			}, console.error);
		} else {
			/* if (!this.fotoMascota) {
				this.notifcaciones.notificacion("No hay selecciondo foto de la mascota");
			} */
			FuncionesGenerales.formularioTocado(this.datosFormulario.formulario);
		}
		this.searching = false;
	}

	obtenerFoto() {
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
		this.notifcaciones.alerta("Seleccione", botones).then(({ role }) => {
			if (role == 'camara' || role == 'galeria') {
				this.camera.getPicture(this['opciones' + role]).then((imageData) => {
					this.fotoMascota = imageData;
					this.imagenGuardar = true;
				}, (err) => {
					if (err != "No Image Selected") {
						this.fotoMascota = null;
						this.imagenGuardar = false;
						this.notifcaciones.notificacion("Error al tomar imagen.");
					}
				});
			}
		}, console.error);
	}

	formataNumero(controlName:any, e: any, separador: string = '.', decimais: number = 2) {
		let a:any = e.detail.value.split('');
		let ns:string = '';
		a.forEach((c:any) => { if (!isNaN(c)) ns = ns + c; });
		ns = parseInt(ns).toString();
		if (ns.length < (decimais+1)) { ns = ('0'.repeat(decimais+1) + ns); ns = ns.slice((decimais+1)*-1); }
		let ans = ns.split('');
		let r = '';
		for (let i=0; i < ans.length; i++) if (i == ans.length - decimais) r = r + separador + ans[i]; else r = r + ans[i];
		this.datosFormulario.formulario.get(controlName).setValue(r);
	}
}
