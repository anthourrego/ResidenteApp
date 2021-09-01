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
		quality: 80, // De 0 a 100
		destinationType: this.camera.DestinationType.DATA_URL,
		encodingType: this.camera.EncodingType.JPEG,
		mediaType: this.camera.MediaType.PICTURE,
		allowEdit: true,
	};
	// Opciones de la galeria
	opcionesgaleria: CameraOptions = {
		quality: 80, // De 0 a 100
		sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
		destinationType: this.camera.DestinationType.DATA_URL,
		allowEdit: true,
	};
	fotoDePerfil: string;
	subject = new Subject();
	subjectMenu = new Subject();
	terceroId: string;
	searching: boolean = true;
	extBase64: string = 'data:image/jpeg;base64,';
	datosForm = {};
	datosUsuario;

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
		this.datosForm = Object.assign(this.datosForm, this.obtenerCampo('nombre', 'nombr'));
		this.datosForm = Object.assign(this.datosForm, this.obtenerCampo('apellidos', 'apell'));
		this.datosForm['fechanacim'] = moment(this.datosForm['fechanacim']).format('YYYY-MM-DD');
		this.datosForm['terceroId'] = this.terceroId;
		this.datosForm['ActualizaDatos'] = this.datosUsuario['ActualizaDatos'];
		this.obtenerInformacion('guardarDatos', 'datosGuardados', this.datosForm);
	}

	async datosGuardados({ mensaje }) {
		this.notificacionService.notificacion(mensaje);
		this.subject.next(true);
		this.datosFormulario.formulario.patchModelValue(this.datosForm);
		if (!this.datosUsuario['ActualizaDatos']) {
			this.datosUsuario['ActualizaDatos'] = moment().toDate();
			this.storage.set('usuario', await this.miPerfilService.encriptar(this.datosUsuario));
		}
		this.suscripcionCambios();
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

	obtenerCampo(llave: string, campo: string) {
		const propiedad = this.datosFormulario.formulario.get(llave).value;
		let valor = FuncionesGenerales.textoConEspacios(propiedad);
		let info = {};
		let array = valor.split(' ', 2);
		// El espacio de string es segun la cantidad que se le envie a la funcion testoConEspacios
		let restante = valor.replace(array[0] + ' ' + (array[1] ? array[1] : ''), '');
		info[campo + 'uno'] = array[0];
		info[campo + 'dos'] = (array[1] ? array[1] + restante : '');
		return info
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
				this.notificacionService.notificacion("Se inicializara la " + role);
				this.camera.getPicture(this['opciones' + role]).then((imageData) => {
					this.notificacionService.notificacion("Imagen tomada con exito");
					this.actualizarFotoPerfil(imageData);
				}, (err) => {
					this.fotoDePerfil = null;
					this.notificacionService.notificacion("Error al tomar imagen");
				});
			}
		}, error => console.log("Error ", error));
	}

	async actualizarFotoPerfil(foto) {
		const datos = { terceroId: this.terceroId, foto };
		this.miPerfilService.informacion(datos, this.rutaGeneral + 'fotoPerfil').then(async ({ mensaje, valido, archivo }) => {
			this.notificacionService.notificacion(mensaje);
			if (valido) {
				this.fotoDePerfil = this.extBase64 + archivo;
				let user = await this.storage.get('usuario').then(resp => resp);
				user = this.miPerfilService.desencriptar(JSON.parse(user));
				user.foto = archivo;
				this.storage.set('usuario', JSON.stringify(user));
			}
		}).catch(error => console.log("Error ", error));
	}

	irObjetoPerdido() {
		this.router.navigateByUrl('/modulos/socios/objeto-perdido');
	}

	obtenerDatosUsuario() {
		this.miPerfilService.informacion({}, this.rutaGeneral + 'usuarioLogueado').then(({ datos }) => {
			if (datos) {
				this.terceroId = datos['TerceroID'];
				this.datosFormulario.formulario.patchModelValue(datos);
				if (datos['foto'] != '') {
					this.fotoDePerfil = this.extBase64 + datos['foto'];
				}
				this.suscripcionCambios();
			}
			this.searching = false;
		}).catch(error => console.log("Error ", error));
	}

}
