import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CambioMenuService } from 'src/app/config/cambio-menu/cambio-menu.service';
import { FuncionesGenerales } from 'src/app/config/funciones/funciones';
import { CargadorService } from 'src/app/servicios/cargador.service';
import { LoginService } from 'src/app/servicios/login.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { StorageService } from 'src/app/servicios/storage.service';
import { ThemeService } from 'src/app/servicios/theme.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {

	appMenuSwipeGesture: boolean;
	menus: Array<{ icon: string, title: string, path: string, badge?: boolean }> = [
		{
			icon: 'car-sport-outline', title: 'Mis vehiculos', path: '/modulos/mis-vehiculos'
		},
		{
			icon: 'paw-outline', title: 'Mis mascotas', path: '/modulos/mis-mascotas'
		},
		{
			icon: 'checkmark-circle-outline', title: 'Autorizar visitantes', path: '/modulos/autorizar-visitantes'
		},
		{
			icon: 'alert-circle-outline', title: 'PQRSF', path: '/modulos/pqrsf'
		},
		{
			icon: 'alarm-outline', title: 'Programar Invitaciones', path: '/modulos/programar-invitaciones'
		},
		{
			icon: 'newspaper-outline', title: 'Incidencias', path: '/modulos/incidencias'
		},
		{
			icon: 'folder-outline', title: 'Servicios', path: '/modulos/servicios'
		},
		{
			icon: 'cube-outline', title: 'Encomiendas', path: '/modulos/encomiendas'
		}
	];

	datosUsuario: Object;
	public logo:string = 'assets/img/Cocora2.png';

	constructor(
		private menuController: MenuController,
		private router: Router,
		public theme: ThemeService,
		private notificacionesService: NotificacionesService,
		private storageService: StorageService,
		private loginService: LoginService,
		private cambioMenuService: CambioMenuService,
		private cargadorService: CargadorService,
	) {
		this.menus = this.menus.sort((a, b) => FuncionesGenerales.ordenar(a, 'title', 1, b));
		this.menus.unshift({
			icon: 'home-outline', title: 'Inicio', path: '/modulos/inicio'
		});
	}

	ngOnInit() {
		this.mostrarLogo();
		this.obtenerUsuario();
	}

	async obtenerUsuario() {
		this.datosUsuario = await this.loginService.desencriptar(JSON.parse(await this.storageService.get('usuario').then(resp => resp)));
		this.datosUsuario = this.datosUsuario['Nombre'];
	}

	toggleMenu(sesion?: boolean) {
		this.menuController.close('first');
	}

	ngOnDestroy() {
		this.menuController.enable(false);
	}

	mostrarConfiguracion(ruta: string) {
		this.router.navigateByUrl(ruta);
		this.toggleMenu();
	}

	get size() {
		return { fontSize: this.theme.getStyle() };
	}

	irPagina(ruta) {
		this.cambioMenuService.cambio(ruta);
		this.router.navigateByUrl(ruta);
	}

	confirmarCerrarSesion() {
		this.notificacionesService.alerta('¿Esta seguro de Cerrar Sesión?').then(respuesta => {
			if (respuesta.role === 'aceptar') {
				this.cargadorService.presentar().then(resp => {
					this.loginService.cerrarSesionUser().then(resp => {
						if (resp && resp.valido == 1) {
							this.storageService.limpiarTodo(true);
							this.notificacionesService.notificacion(resp.mensaje);
						} else {
							this.notificacionesService.notificacion(resp.mensaje);
						}
						this.cargadorService.ocultar();
					});
				}).catch(error => {
					this.cargadorService.ocultar();
				});
			}
		}, console.error);
	}

	async mostrarLogo(){
		let validarLogo = JSON.parse(await this.storageService.get('logo').then(resp => resp)); 
		if (validarLogo != '') this.logo = this.loginService.url + validarLogo;
	}

	irMiPerfil() {
		this.router.navigateByUrl('modulos/mi-perfil');
	}

}
