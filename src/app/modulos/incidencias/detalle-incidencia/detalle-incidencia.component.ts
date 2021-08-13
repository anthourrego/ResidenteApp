import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { PeticionService } from 'src/app/config/peticiones/peticion.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import * as moment from 'moment';

@Component({
    selector: 'app-detalle-incidencia',
    templateUrl: './detalle-incidencia.component.html',
    styleUrls: ['./detalle-incidencia.component.scss'],
})
export class DetalleIncidenciaComponent implements OnInit {
    @Input() datos: Object;
    searching: boolean = true;
	rutaFoto: string = this.peticionServices.url;
    segmento: string = 'informacion';
    rutaGeneral: string = 'Propietario/Incidencia/cIncidencia/';
	listaNotas: Array<object> = [];
	listaHistorial: Array<object> = [];

    constructor(
        private modalController: ModalController,
		private peticionServices: PeticionService,
		private notificaciones: NotificacionesService,
		private alertController: AlertController
    ) { }

    ngOnInit() {
        this.detalleIncidencias();
    }

    cerrarModal() {
		this.modalController.dismiss();
    }

    cambioSegmento(ev: any) {
		this.segmento =  ev.detail.value;
	}

    async detalleIncidencias() {
		this.searching = true;
		await this.peticionServices.informacion({id: this.datos['HeadIncidenciaid'] }, this.rutaGeneral + 'ver').then(({ success, datos, msg }) => {
			if (success) {
				this.datos = datos.informacion;
				this.datos['Fecha'] = moment(this.datos['Fecha']).format('DD/MM/YYYY');
                this.listaNotas = datos.notas.map(it => {
					it.FechaRegis = moment(it.FechaRegis).format('DD/MM/YYYY hh:mm:ss A');
                    it.collapse = false;
					return it;
				})

                this.listaHistorial = datos.historico.map(it => {
                    it.FechaRegis =  moment(it.FechaRegis).format('DD/MM/YYYY hh:mm:ss A');
                    it.collapse = false;
                    return it;
                });
			} else {
				this.notificaciones.notificacion(msg);
			}
			this.searching = false;
		});
	}

    collapse(variable, item){
		if (this[variable][item]['collapse'] == false) {
			this[variable].forEach(element => element['collapse'] = false);
	
			this[variable][item]['collapse'] = true;
		} else {
			this[variable][item]['collapse'] = false;
		}
	}

	async abrirArchivo(item){
		console.log(item);
		if (item.extension == 'jpg' || item.extension == 'jpeg' || item.extension == 'png' || item.extension == 'gif') {
			const alert = await this.alertController.create({
				message: '<ion-img src="' + this.rutaFoto + item.Archivo.substr(2) + '"></ion-img>',
				buttons: ['OK']
			});
	
			await alert.present();
	
			await alert.onDidDismiss();
		}
	}

}
