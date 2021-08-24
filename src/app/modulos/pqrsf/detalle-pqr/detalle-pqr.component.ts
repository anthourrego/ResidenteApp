import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { PeticionService } from 'src/app/config/peticiones/peticion.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import * as moment from 'moment';
import { StorageService } from 'src/app/servicios/storage.service';

@Component({
	selector: 'app-detalle-pqr',
	templateUrl: './detalle-pqr.component.html',
	styleUrls: ['./detalle-pqr.component.scss'],
})
export class DetallePQRComponent implements OnInit {

	@Input() datos: string;
	rutaFoto: string = this.peticionServices.url;
	searching: boolean = true;
	segmento: string = 'informacion';
	rutaGeneral: string = 'Propietario/PQR/cPQR/';
	listaNotas: Array<object> = [];
	listaHistorial: Array<object> = [];

	constructor(
		private modalController: ModalController,
		private peticionServices: PeticionService,
		private notificaciones: NotificacionesService,
		private alertController: AlertController,
		private storageService: StorageService
	) { }

	ngOnInit() {
		this.detallePQR();
	}

	cerrarModal() {
		this.modalController.dismiss();
	}

	cambioSegmento(ev: any) {
		this.segmento =  ev.detail.value;
	}

	async detallePQR() {
		this.searching = true;
		await this.peticionServices.informacion({id: this.datos['PQRId'] }, this.rutaGeneral + 'ver').then(({ success, datos, msg }) => {
			if (success) {
				this.datos = datos.informacion;
				this.datos['Fecha'] = moment(this.datos['Fecha']).format('DD/MM/YYYY');
				this.listaNotas = datos.notas;

				this.listaHistorial.push({
					Fecha: this.datos['Fecha']
					,Usuario: this.datos['Usuario']
					,Cambio: 'Nueva PQR'
				}); 
				
				for (let i = 0; i < this.listaNotas.length; i++) {
					this.listaNotas[i]['collapse'] = false; 
					this.listaNotas[i]['FechaRegis'] = moment(this.listaNotas[i]['FechaRegis']).format('DD/MM/YYYY hh:mm:ss A');
					
					let Cambio = '';

					if (i == 0) {
						Cambio = "Cambio estado Abierto => " + this.listaNotas[i]['Estado'];
					}else if (this.listaNotas[i-1]['Estado'] != this.listaNotas[i]['Estado']) {
						Cambio = "Cambio estado " + this.listaNotas[i-1]['Estado'] + " => " + this.listaNotas[i]['Estado'];
					}

					if(Cambio != ''){
						this.listaHistorial.push({
							Fecha: moment(this.listaNotas[i]['Fecha']).format('DD/MM/YYYY')
							,Usuario: this.listaNotas[i]['nombre']
							,Cambio
						}); 
					}
				}

			} else {
				this.notificaciones.notificacion(msg);
			}
			this.searching = false;
		});
	}

	collapse(item){
		if (this.listaNotas[item]['collapse'] == false) {
			this.listaNotas.forEach(element => element['collapse'] = false);
	
			this.listaNotas[item]['collapse'] = true;
		} else {
			this.listaNotas[item]['collapse'] = false;
		}
	}

	async abrirArchivo(item){
		if (item.extension == 'jpg' || item.extension == 'jpeg' || item.extension == 'png' || item.extension == 'gif') {
			/*Aqui*/ 
			let nit = await this.peticionServices.desencriptar(JSON.parse(await this.storageService.get('usuario').then(resp => resp)));
			nit = nit['Nit'];
			const alert = await this.alertController.create({
				message: '<ion-img src="' + this.rutaFoto + '/uploads/' + nit + '/pqr/' + item.Archivo + '"></ion-img>',
				buttons: ['OK']
			});
	
			await alert.present();
	
			await alert.onDidDismiss();
		}
	}

}
