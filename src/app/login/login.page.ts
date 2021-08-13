import { Component, OnInit } from '@angular/core';
import { RxFormGroup } from '@rxweb/reactive-form-validators';
import { DomSanitizer } from '@angular/platform-browser';
import { FuncionesGenerales } from '../config/funciones/funciones';
import { LoginService } from '../servicios/login.service';
import { CargadorService } from '../servicios/cargador.service';
import { NotificacionesService } from '../servicios/notificaciones.service';
import { StorageService } from '../servicios/storage.service';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { IonicSelectableComponent } from "ionic-selectable";
import { ThemeService } from '../servicios/theme.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, ViewWillEnter{

  	formLogin: { formulario: RxFormGroup, propiedades: Array<string> };
  	ingresoDocumento: Boolean = true;
	conjuntos: Array<Object>;
		
	claseDocumento: string = '';
	claseUsuario: string = '';
	verPassword: Boolean = false;
	urlFondoImagen: string = "assets/img/Cocora.png";
	urlFondoImagenSize: string = "290px 350px";

	constructor(
		private sanitizer: DomSanitizer,
		private theme: ThemeService,
		private router: Router,
		private notificaciones: NotificacionesService,
		private loginService: LoginService,
		private storageService: StorageService,
		private cargadorService: CargadorService,
  	) {}

	ngOnInit() {
		this.configForm();
	}

	ionViewWillEnter() {
		this.validarAccion();
	}

	async validarAccion() {
		let resp = await this.storageService.get('nroDocumento').then(resp => resp);
		if (resp) {
			this.formLogin.formulario.get('nroDocumento').setValue(resp);
			this.formLogin.formulario.get('conjunto').markAsUntouched();
			this.formLogin.formulario.get('password').markAsUntouched();
			this.irFormulario();
		}
	}

	configForm() {
		this.formLogin = FuncionesGenerales.crearFormulario(this.loginService);
	}

	obtenerFondo() {
		return this.sanitizer.bypassSecurityTrustStyle(`background-image: url(${this.urlFondoImagen});
														background-repeat: no-repeat;
														background-size: ${this.urlFondoImagenSize};
														background-position: center;
														background-attachment: fixed;`);
	}

  	irFormulario() {
		this.cargadorService.presentar().then(resp => {
			if (this.formLogin.formulario.get('nroDocumento').valid) {
				const nroDocumento = this.formLogin.formulario.get('nroDocumento').value;
				this.loginService.validarCedula(nroDocumento).then(respuesta => {
					if (respuesta && respuesta.valido) {
						this.storageService.set('nroDocumento', nroDocumento);
						this.conjuntos = respuesta.conjuntos;
						if (this.conjuntos.length == 1) {
							this.formLogin.formulario.get('conjunto').setValue(this.conjuntos[0]);
							this.formLogin.formulario.get('nombreUsuario').setValue(this.conjuntos[0]['Nombre']);
							this.formLogin.formulario.get('usuario').setValue(this.conjuntos[0]['CodigoUsuario']);	
							this.urlFondoImagen = environment.urlBack + this.conjuntos[0]['Fondo'];
							this.urlFondoImagenSize = "cover";	
						}
						this.claseDocumento = 'animate__fadeOutLeft';
						this.ejecutarTimer('claseUsuario', 'animate__fadeInRight').then(item => this.ingresoDocumento = !this.ingresoDocumento);
					} else {
						this.notificaciones.notificacion(respuesta.mensaje);
					}
					this.cargadorService.ocultar();
				}, error => {
					console.log(error);
					//this.notificaciones.notificacion(error);
					this.notificaciones.notificacion("Error de conexión.");
					this.cargadorService.ocultar();
				});
			}
		});
	}

	async ejecutarTimer(variable: string, clase: string) {
		return await timer(200).toPromise().then(resp => this[variable] = clase);
	}

	retornar() {
		this.formLogin.formulario.reset();
		this.urlFondoImagenSize = "290px 350px";
		this.urlFondoImagen = "assets/img/Cocora.png";
		this.claseUsuario = 'animate__fadeOutRight';
		this.ejecutarTimer('claseDocumento', 'animate__fadeInLeft').then(item => this.ingresoDocumento = !this.ingresoDocumento);
	}

	get fontSize() {
		return { 'fontSize': this.theme.getStyle() };
	};

	login() {
		if (this.formLogin.formulario.valid) {
			this.cargadorService.presentar().then(resp => {
				const data = this.formLogin.formulario.value;
				this.loginService.iniciarSesionUser(data).then(async respuesta => {
					if (respuesta && respuesta.valido) {
						const datosUsuario = this.formLogin.formulario.get('conjunto').value;
						this.storageService.set('conexion', JSON.stringify(respuesta.db));
						this.storageService.set('ingreso', JSON.stringify(respuesta.ingreso));
						this.storageService.set('logo', JSON.stringify(respuesta.logo));
						await this.storageService.set('crypt', respuesta.crypt);
						this.storageService.set('usuario', this.loginService.encriptar(datosUsuario));
						this.router.navigateByUrl('/modulos/inicio');
						this.formLogin.formulario.reset();
						this.retornar();
					} else {
						this.notificaciones.notificacion(respuesta.mensaje);
					}
					this.cargadorService.ocultar();
				}, error => {
					console.error("Error ", error);
					this.cargadorService.ocultar();
				});
			});
		} else {
			FuncionesGenerales.formularioTocado(this.formLogin.formulario);
		}
	}

	cambioConjunto(event: { component: IonicSelectableComponent; value: any }) {
		this.urlFondoImagen = environment.urlBack + event.value.Fondo;
		this.urlFondoImagenSize = "cover";
		this.formLogin.formulario.get('nombreUsuario').setValue(event.value.Nombre);
		this.formLogin.formulario.get('usuario').setValue(event.value.CodigoUsuario);	
	}
}
