import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'Crypto-js'
import { Observable } from 'rxjs';
import { StorageService } from '../../servicios/storage.service';
import { FuncionesGenerales } from '../funciones/funciones';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

export class CustomInjectorService {
	static injector: Injector
}

@Injectable({
	providedIn: 'root'
})
export class PeticionService {

	private storageService: StorageService;
	private notificacionesService: NotificacionesService;
	private httpClient: HttpClient;
	public url: string = environment.urlBack;
	public categoria: string = 'API/';

	constructor() {
		if (!this.httpClient) {
			this.httpClient = CustomInjectorService.injector.get<HttpClient>(HttpClient);
		}
		if (!this.storageService) {
			this.storageService = CustomInjectorService.injector.get<StorageService>(StorageService);
		}
	}

	async encriptar(datos) {
		const salt = CryptoJS.lib.WordArray.random(256);
		const iv = CryptoJS.lib.WordArray.random(16);
		const crypt = JSON.parse(await this.storageService.get('crypt').then(resp => resp));
		const key = CryptoJS.PBKDF2(crypt.key, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: crypt.it });
		const encrypted = CryptoJS.AES.encrypt(JSON.stringify(datos), key, { iv: iv });
		const data = {
			ciphertext: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
			salt: CryptoJS.enc.Hex.stringify(salt),
			iv: CryptoJS.enc.Hex.stringify(iv)
		}
		return JSON.stringify(data);
	}

	async desencriptar(encriptado) {
		const salt = CryptoJS.enc.Hex.parse(encriptado.salt);
		const iv = CryptoJS.enc.Hex.parse(encriptado.iv);
		const crypt = JSON.parse(await this.storageService.get('crypt').then(resp => resp));
		const key = CryptoJS.PBKDF2(crypt.key, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: crypt.it });
		const decrypted = CryptoJS.AES.decrypt(encriptado.ciphertext, key, { iv: iv });
		return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
	}

	async obtener(controlador: string) {
		const uri = this.construirUrl(controlador);
		return await this.ejecutarPeticion('get', uri).toPromise().then(resp => this.desencriptar(resp), console.error);
	}

	async informacion(body: object, controlador: string) {
		const data = {
			encriptado: await this.encriptar(body)
		}
		const uri = this.construirUrl(controlador);
		const Conexion = await this.storageService.get('conexion').then(resp => resp);
		const Cedula = await this.storageService.get('nroDocumento').then(resp => resp);
		let ingreso = await this.desencriptar(JSON.parse(await this.storageService.get('ingreso').then(resp => resp)));
		let nit = await this.desencriptar(JSON.parse(await this.storageService.get('usuario').then(resp => resp)));
		const headers = new HttpHeaders({ Token: ingreso.IngresoId, Conexion, Cedula, Nit: nit.Nit, Usuario: nit.CodigoUsuario });
		return await this.ejecutarPeticion('post', uri, data, headers).toPromise().then(async resp => {
			const desencriptado = await this.desencriptar(resp);
			if (desencriptado.activoLogueo) {
				// return Ejecutar cerrar sesion
				this.storageService.limpiarTodo();
			} else {
				return desencriptado;
			}
		}).catch((request) => {
			this.validarAlertaError(request);
		});
	}

	private construirUrl(controlador) {
		return this.url + this.categoria + controlador;
	}

	async validarCedula(Cedula) {
		return await this.ejecutarPeticion('post', `${this.url}Login/validarUsuarioCedula`, { Cedula }).toPromise().then(resp => resp, console.error);
	}

	async iniciarSesionUser(data) {
		//const conexion = await this.storageService.get('conexion').then(resp => resp);
		//const Accion = await this.storageService.get('accion').then(resp => resp);
		data = {
			usuario: data.usuario,
			nroDocumento: data.nroDocumento,
			nit: data.conjunto.Nit,
			clave: data.password,
			RASTREO: FuncionesGenerales.rastreo('Ingresa al Sistema Cocora Residente', 'Ingreso Sistema'),
		};

		//const headers = new HttpHeaders({ Accion });
		return await this.ejecutarPeticion('post', `${this.url}Login/ingresoMovil`, data).toPromise().then(resp => resp, console.error);
	}

	async cerrarSesionUser() {
		const Conexion = await this.storageService.get('conexion').then(resp => resp);
		let ingreso = await this.desencriptar(JSON.parse(await this.storageService.get('ingreso').then(resp => resp)));

		let data = {
			ingreso: ingreso.IngresoId,
			usuario: ingreso.usuarioId
		};
		const headers = new HttpHeaders({ Conexion, Token: ingreso.IngresoId });
		return await this.ejecutarPeticion('post', `${this.url}Login/cierreMovil`, data, headers).toPromise().then(resp => this.desencriptar(resp), console.error);
	}

	ejecutarPeticion(verboPeticion: string, url: string, data?: object, headers?: HttpHeaders): Observable<any> {
		if (verboPeticion === 'get') {
			return this.httpClient.get(url);
		}
		return this.httpClient.post(url, data, { headers });
	}

	private validarAlertaError(request) {
		if (request.error != '' && request.error != undefined) {
			let encabezado = "Se ha producido un problema";
			let encabezado2 = 'Error';
			let opciones = [];
			let mensaje = `Para obtener más información de este problema y posibles correcciones, pulse el botón "Ver Detalle" y comuniquese a la línea de servicio al cliente.`;
			if (request.error.text != '' && request.error.text != undefined) {
				mensaje = `Para obtener más información de este problema y posibles correcciones, pulse el botón "Ver Detalle" y comuniquese a la línea de servicio al cliente.`;

				opciones = [{
					text: 'Ver Detalle',
					handler: () => {
						this.notificacionesService.alerta(request.error.text, "Error", ['alerta-error'],
							[{
								text: 'Cerrar',
								role: 'aceptar',
								handler: () => {
									this.storageService.limpiarTodo(true);
								}
							}]
						);
					}
				}, {
					text: 'Cerrar',
					role: 'cancel',
					handler: () => {
						this.storageService.limpiarTodo(true);
					}
				}];
			} else {
				if (request.error.includes('DELETE') && request.error.includes('REFERENCE') && request.error.includes('FK')) {
					mensaje = 'No se puede eliminar, el registro se encuentra referenciado en otras tablas.';
					encabezado = 'Error de Integridad';
					encabezado2 = encabezado;
				}
				opciones = [{
					text: 'Ver Detalle',
					handler: () => {
						this.notificacionesService.alerta(request.error, "Error", ['alerta-error'], [{ text: 'Cerrar', role: 'aceptar' }]);
					}
				}, {
					text: 'Cerrar',
					role: 'cancel'
				}];
			}
			this.notificacionesService.alerta(mensaje, encabezado, [], opciones);

		}
	}

}
