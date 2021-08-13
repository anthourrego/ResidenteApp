import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NotificacionesService } from './notificaciones.service';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	constructor(
		private storage: Storage
		,private router: Router
		,private modalController: ModalController
		,private notifcaciones: NotificacionesService
	) { }

	set(llave: string, valor: any) {
		this.storage.set(llave, valor);
	}

	async get(llave: string) {
		return await this.storage.get(llave);
	}

	remove(llave: string) {
		this.storage.remove(llave);
	}

	limpiarTodo(logout?) {
		this.storage.clear();
		if(!logout) this.notifcaciones.alerta("Error de conexión", [{text: 'Cerrar', role: 'aceptar'}]);
		if(!this.modalController) this.modalController.dismiss();
		this.router.navigateByUrl('login');
	}
}
