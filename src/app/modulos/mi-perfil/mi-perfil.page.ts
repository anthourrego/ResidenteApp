import { Component, OnInit } from '@angular/core';
import { RxFormGroup } from '@rxweb/reactive-form-validators';
import * as moment from 'moment';
import { Constantes } from 'src/app/config/constantes/constantes';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Subject } from 'rxjs';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { Router } from '@angular/router';
import { CambioMenuService } from 'src/app/config/cambio-menu/cambio-menu.service';
import { StorageService } from 'src/app/servicios/storage.service';
import { FuncionesGenerales } from 'src/app/config/funciones/funciones';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MiPerfilService } from 'src/app/servicios/mi-perfil.service';

@Component({
	selector: 'app-mi-perfil',
	templateUrl: './mi-perfil.page.html',
	styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {

	rutaGeneral: string = 'Propietario/Miperfil/cMiPerfil/';
	datosFormulario: { formulario: RxFormGroup, propiedades: Array<string> };
	generos = Constantes.generos;
	maximoFechanacimiento = moment().format('YYYY-MM-DD');
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
	fotoDePerfil: string;
	subject = new Subject();
	subjectMenu = new Subject();
	terceroId: string;
	searching: boolean = true;
	extBase64: string = 'data:image/jpg;base64,';
	datosForm = {};
	datosUsuario;
	localizaciones: any = {};
	estadoCivil: any = [];
	datosSeleccionados = {};
	cambiovalor: boolean;
	llaveActual: string = '';

	constructor(
		private notificacionService: NotificacionesService,
		private camera: Camera,
		private router: Router,
		private miPerfilService: MiPerfilService,
		private menu: CambioMenuService,
		private storage: StorageService
	) { }

	ngOnInit() {
		this.datosFormulario = FuncionesGenerales.crearFormulario(this.miPerfilService);
		this.obtenerUsuario();
	}

	async obtenerUsuario() {
		this.datosUsuario = await this.miPerfilService.desencriptar(JSON.parse(await this.storage.get('usuario').then(resp => resp)));
	}

	ionViewDidEnter() {
		this.searching = true;
		this.obtenerDatosUsuario();
		this.menu.suscripcion().pipe(
			takeUntil(this.subjectMenu)
		).subscribe(() => {
			this.subject.next(true);
			this.subjectMenu.next(true);
		}, error => {
			console.log("Error ", error);
		}, () => console.log("Completado Menú !!"));
	}

	suscripcionCambios() {
		this.datosFormulario.formulario.valueChanges.pipe(
			debounceTime(1000),
			takeUntil(this.subject)
		).subscribe(() => {
			if (this.datosFormulario.formulario.valid) {
				this.guardarInformacion();
			} else {
				FuncionesGenerales.formularioTocado(this.datosFormulario.formulario);
			}
		}, error => {
			console.log("Error ", error);
		}, () => console.log("Completado Cambio Formulario !!"));
	}

	guardarInformacion() {
		this.datosForm = Object.assign({}, this.datosFormulario.formulario.value);
		this.datosForm['fechanacim'] = moment(this.datosForm['fechanacim']).format('YYYY-MM-DD');
		this.datosForm['terceroId'] = this.terceroId;
		this.datosForm = { ActualizaDatos: this.datosUsuario['ActualizaDatos'], ...this.datosForm };
		Object.keys(this.datosSeleccionados).forEach(it => {
			this.datosForm[it] = this.datosSeleccionados[it];
		});
		console.log("Funciona ", this.datosForm);
		this.obtenerInformacion('guardarDatos', 'datosGuardados', this.datosForm);
	}

	async datosGuardados({ mensaje, ciudades, ciudadesCorre }) {
		this.notificacionService.notificacion(mensaje);
		this.subject.next(true);
		this.datosFormulario.formulario.patchModelValue(this.datosForm);
		if (!this.datosUsuario['ActualizaDatos']) {
			this.datosUsuario['ActualizaDatos'] = moment().toDate();
			this.storage.set('usuario', await this.miPerfilService.encriptar(this.datosUsuario));
		}
		this.cambiovalor = !this.cambiovalor;
		this.suscripcionCambios();
		console.log('ciudades ', ciudades);
		if (this.llaveActual == 'dptoid' && ciudades && ciudades.length) {
			this.localizaciones['ciudades'] = ciudades;
		}
		if (this.llaveActual == 'dptocorre' && ciudadesCorre && ciudadesCorre.length) {
			this.localizaciones['ciudadesCorre'] = ciudadesCorre;
		}
		this.datosSeleccionados = {};
	}

	obtenerInformacion(metodo, funcion, datos = {}, event?) {
		this.searching = true;
		this.miPerfilService.informacion(datos, this.rutaGeneral + metodo).then(resp => {
			if (resp.success) {
				this[funcion](resp);
			} else {
				this.notificacionService.notificacion(resp.msg);
			}
			this.searching = false;
			if (event) event.target.complete();
		}, console.error).catch(err => {
			console.log("Error ", err);
			this.searching = false;
			if (event) event.target.complete();
		}).catch(error => console.log("Error ", error));
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
		this.notificacionService.alerta("Seleccionemos tu foto de perfil", null, [], botones).then(({ role }) => {
			if (role == 'camara' || role == 'galeria') {
				this.camera.getPicture(this['opciones' + role]).then((imageData) => {
					this.actualizarFotoPerfil(imageData);
				}, (err) => {
					if (err != "No Image Selected") {
						this.fotoDePerfil = null;
						this.notificacionService.notificacion("Error al tomar imagen");
					}
				});
			}
		}, error => console.log("Error ", error));
	}

	async actualizarFotoPerfil(foto) {
		const datos = { terceroId: this.terceroId, foto };
		this.miPerfilService.informacion(datos, this.rutaGeneral + 'fotoPerfil').then(async ({ mensaje, success, archivo }) => {
			this.notificacionService.notificacion(mensaje);
			if (success) {
				this.fotoDePerfil = foto;
				let user = await this.storage.get('usuario').then(resp => resp);
				user = this.miPerfilService.desencriptar(JSON.parse(user));
				user.foto = foto;
				this.storage.set('usuario', JSON.stringify(user));
			}
		}).catch(error => console.log("Error ", error));
	}

	irObjetoPerdido() {
		this.router.navigateByUrl('/modulos/socios/objeto-perdido');
	}

	obtenerDatosUsuario() {
		this.miPerfilService.informacion({}, this.rutaGeneral + 'usuarioLogueado').then(({ datos, localizaciones, estadoCivil }) => {
			if (datos) {
				this.localizaciones = JSON.parse(localizaciones);
				this.estadoCivil = JSON.parse(estadoCivil);
				this.terceroId = datos['TerceroID'];
				this.datosFormulario.formulario.patchModelValue(datos);
				if (datos['foto'] != '') {
					this.fotoDePerfil = datos['foto'];
				}
				this.suscripcionCambios();
			}
			this.searching = false;
		}).catch(error => console.log("Error ", error));
	}

	cambiosComponenteSelect(evento, key) {
		this.datosSeleccionados[evento.control] = evento.valor[evento.key];
		this.llaveActual = key;
		if (evento.key == 'dptoid') {
			this.datosFormulario.formulario.get('ciudadid').setValue('');
		}
		if (evento.key == 'dptocorre') {
			this.datosFormulario.formulario.get('ciudacorre').setValue('');
		}
		this.guardarInformacion();
	}



}
