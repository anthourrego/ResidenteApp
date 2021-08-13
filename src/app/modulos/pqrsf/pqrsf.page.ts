import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { PeticionService } from 'src/app/config/peticiones/peticion.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { AgregarPqrsfrComponent } from './agregar-pqrsfr/agregar-pqrsfr.component';
import { DetallePQRComponent } from './detalle-pqr/detalle-pqr.component';
import { FiltrosPqrComponent } from './filtros-pqr/filtros-pqr.component';

@Component({
	selector: 'app-pqrsf',
	templateUrl: './pqrsf.page.html',
	styleUrls: ['./pqrsf.page.scss'],
})
export class PQRSFPage implements OnInit {

	rutaGeneral: string = 'Propietario/PQR/cPQR/';
	listaPQRSF: Array<object> = [];
	tipoPQR: Array<object> = [];
	btnAgregarPQRSF: boolean = true;
	searching: boolean = true;
	obtCant = 12;
	eventoScroll
	inicio: number = 0;
	fin: number = 12;
	buscarLista: string = '';
	fechaInicio: string = '';
	fechaFin: string = '';
	tipoReunion: Array<string> = [];

	constructor(
		private modalController: ModalController,
		private peticionServices: PeticionService,
		private notificaciones: NotificacionesService,
	) { }

	ngOnInit() {
		let datos = {
			inicio: this.inicio,
			fin: this.fin,
			where: this.buscarLista,
			fechaInicio: this.fechaInicio,
			fechaFin: this.fechaFin,
			tipoReunion: this.tipoReunion
		}
		this.listaPQR(datos);
		this.searching = true;
		this.obtenerTipoPQR();
	}

	async formularioPQRSF(accion = "crear") {
		let componentProps = { accion, tipoPQR: this.tipoPQR };
		const modal = await this.modalController.create({
			component: AgregarPqrsfrComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps
		});
		await modal.present();
		modal.onWillDismiss().then(({data}) => {
			if (data == 'listar') {
				this.listaPQRSF = [];
				let datos = {
					inicio: this.inicio,
					fin: this.fin,
					where: this.buscarLista,
					fechaInicio: this.fechaInicio,
					fechaFin: this.fechaFin,
					tipoReunion: this.tipoReunion
				}
				this.listaPQR(datos);
			}
		}, console.error);
	}

	async detallePQR(datos){
		let componentProps = { datos };
		const modal = await this.modalController.create({
			component: DetallePQRComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps
		});
		await modal.present();
	}


	async obtenerTipoPQR() {
		this.searching = true;
		this.peticionServices.informacion({}, this.rutaGeneral + 'tipoPQR').then(({ success, datos, vivienda, msg }) => {
			if (success) {
				this.tipoPQR = datos;
				if (this.tipoPQR.length > 0 ) {
					this.btnAgregarPQRSF = false;
				} else {
					this.btnAgregarPQRSF = true;
				}
				this.searching = false;
			} else {
				this.notificaciones.notificacion(msg);
			}
		});
	}

	async listaPQR(datos, event?) {
		this.searching = true;
		this.peticionServices.informacion(datos, this.rutaGeneral + 'obtenerPQR').then(({ success, datos, msg }) => {
			if (success) {
				datos = datos.map(it => {
					it.Fecha = moment(it.Fecha).format('DD/MM/YYYY');
					return it;
				});
				this.listaPQRSF = this.listaPQRSF.concat(datos);
				if (datos.length && this.fin >= +this.listaPQRSF[this.listaPQRSF.length - 1]['totCol']) {
					if(this.eventoScroll) this.eventoScroll.target.disabled = true;
				}
				this.searching = false;
			} else {
				this.notificaciones.notificacion(msg);
			}
			if (this.eventoScroll) {
				this.eventoScroll.target.complete();
			}
			if (event){
				event.target.complete();
			}
		}, console.error);
	}

	loadData(event) {
		this.inicio += this.obtCant;
		this.fin += this.obtCant;
		this.eventoScroll = event;
		let datos = {
			inicio: this.inicio,
			fin: this.fin,
			where: this.buscarLista,
			fechaInicio: this.fechaInicio,
			fechaFin: this.fechaFin,
			tipoReunion: this.tipoReunion
		}
		this.listaPQR(datos);
	}

	slidingGeneral(ref) {
		let elem: any = document.getElementById(ref);
		(elem as IonItemSliding).getSlidingRatio().then(numero => {
			if (numero === 1) {
				(elem as IonItemSliding).close();
			} else {
				(elem as IonItemSliding).open("end");
			}
		});
	}

	buscarFiltro(evento) {
		this.listaPQRSF = [];
		this.buscarLista = evento.detail.value;
		let datos = {
			inicio: 0,
			fin: 12,
			where: this.buscarLista,
			fechaInicio: this.fechaInicio,
			fechaFin: this.fechaFin,
			tipoReunion: this.tipoReunion
		}
		this.listaPQR(datos);
	}

	refreshPQR(event){
		this.listaPQRSF = [];
		let datos = {
			inicio: 0,
			fin: 12,
			where: this.buscarLista,
			fechaInicio: this.fechaInicio,
			fechaFin: this.fechaFin,
			tipoReunion: this.tipoReunion
		}
		this.listaPQR(datos, event);
	}

	async filtros(){
		let componentProps = {fechaInicio: this.fechaInicio, fechaFin: this.fechaFin, tipoReunion: this.tipoReunion, selectTipoPQR: this.tipoPQR};
		const modal = await this.modalController.create({
			component: FiltrosPqrComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps
		});
		await modal.present();
		modal.onWillDismiss().then(({ data }) => {
			if(data){
				this.listaPQRSF = [];
				document.getElementById("searchFiltro").getElementsByTagName("input")[0].value = '';
				this.buscarLista = '';
				this.fechaInicio = '';
				this.fechaFin = '';
				this.tipoReunion = [];
				
				if (data != 'todo'){
					this.fechaInicio = data.desde ? data.desde : '';
					this.fechaFin = data.hasta ? data.hasta : '';
					this.tipoReunion = data.tipoReunion ? data.tipoReunion : [];
				}

				let datos = {
					inicio: 0,
					fin: 12,
					where: this.buscarLista,
					fechaInicio: this.fechaInicio,
					fechaFin: this.fechaFin,
					tipoReunion: this.tipoReunion
				}

				this.listaPQR(datos);
			}
		}, console.error);
	}

}
