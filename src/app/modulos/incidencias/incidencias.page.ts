import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { IncidenciaService } from '../../servicios/incidencia.service';
import { RegistrarIncidenciaComponent } from './registrar-incidencia/registrar-incidencia.component';
import { DetalleIncidenciaComponent } from './detalle-incidencia/detalle-incidencia.component';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import * as moment from 'moment';
import { FiltrosIncidenciaComponent } from './filtros-incidencia/filtros-incidencia.component';

@Component({
	selector: 'app-incidencias',
	templateUrl: './incidencias.page.html',
	styleUrls: ['./incidencias.page.scss'],
})
export class IncidenciasPage implements OnInit {

	rutaGeneral: string = 'Propietario/Incidencia/cIncidencia/';
	searching: boolean = false;
	listaIncidencias: Array<object> = [];
	equiposIncidencia: Array<object> = [];
	tiposIncidencia: Array<object> = [];
	obtCant = 12;
	eventoScroll;
	inicio: number = 0;
	fin: number = 12;
	buscarLista: string = '';
	fechaInicio: string = '';
	fechaFin: string = '';
	estados: Array<string> = [];

	constructor(
		private modalController: ModalController,
		private notificaciones: NotificacionesService,
		private incidenciaService: IncidenciaService,
	) { }

	ionViewWillEnter() {
		this.listaIncidencias = [];
		let datos = {
			inicio: this.inicio,
			fin: this.fin,
			where: this.buscarLista,
			fechaInicio: this.fechaInicio,
			fechaFin: this.fechaFin,
			estado: this.estados
		}
		this.obtenerInformacion('obtenerIncidencias', 'incidencias', datos);
		this.obtenerInformacion('informacionForm', 'informacionCrear');
	}

	ngOnInit() {
	}

	verIncidencia(tipo: string, datos: any) {
		let info = { ProgIngresoId: datos.ProgIngresoId };
		this.searching = true;
		this.incidenciaService.informacion(info, this.rutaGeneral + 'obtenerProgramacion').then(({ success, datos }) => {
			if (success) {
				this.formProgramar(datos, true);
			}
			this.searching = false;
		}, console.error);
	}

	async formProgramar(datos?, ver?) {
		const modal = await this.modalController.create({
			component: ver ? DetalleIncidenciaComponent : RegistrarIncidenciaComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps: { datos, equipos: this.equiposIncidencia, tiposIncidencias: this.tiposIncidencia }
		});
		await modal.present();
		modal.onWillDismiss().then(({ data }) => {
			if (data == 'listar') {
				this.listaIncidencias = [];
				let datos = {
					inicio: 0,
					fin: 12,
					where: this.buscarLista,
					fechaInicio: this.fechaInicio,
					fechaFin: this.fechaFin,
					estado: this.estados
				}
				this.obtenerInformacion('obtenerIncidencias', 'incidencias', datos);
			}
		}, console.error);
	}

	obtenerInformacion(metodo, funcion, datos = {}, event?) {
		this.searching = true;
		this.incidenciaService.informacion(datos, this.rutaGeneral + metodo).then(resp => {
			this[funcion](resp);
			this.searching = false;
			if(event){
				event.target.complete();
			}
		}, console.error);
	}

	incidencias({ success, msg, vivienda, datos }) {
		if (success) {
			datos = datos.map(it => {
				it.Fecha = moment(it.Fecha).format('DD/MM/YYYY');
				return it;
			});
			this.listaIncidencias = this.listaIncidencias.concat(datos);
			if (datos.length && this.fin >= +this.listaIncidencias[this.listaIncidencias.length - 1]['totCol']) {
				if (this.eventoScroll) this.eventoScroll.target.disabled = true;
			}
		} else {
			this.notificaciones.notificacion(msg);
		}
		if (this.eventoScroll) {
			this.eventoScroll.target.complete();
		}
	}

	informacionCrear({ tipoIncidencias, equipos }) {
		this.tiposIncidencia = tipoIncidencias;
		this.equiposIncidencia = equipos;
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
			estado: this.estados
		}
		this.obtenerInformacion('obtenerIncidencias', 'incidencias', datos);
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

	async detalleIncidencia(datos){
		let componentProps = { datos };
		const modal = await this.modalController.create({
			component: DetalleIncidenciaComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps
		});
		await modal.present();
	}

	buscarFiltro(evento) {
		this.listaIncidencias = [];
		this.buscarLista = evento.detail.value;
		let datos = {
			inicio: 0,
			fin: 12,
			where: this.buscarLista,
			fechaInicio: this.fechaInicio,
			fechaFin: this.fechaFin,
			estado: this.estados
		}
		this.obtenerInformacion('obtenerIncidencias', 'incidencias', datos);
	}

	refreshIncidencias(event){
		this.listaIncidencias = [];
		let datos = {
			inicio: 0,
			fin: 12,
			where: this.buscarLista,
			fechaInicio: this.fechaInicio,
			fechaFin: this.fechaFin,
			estado: this.estados
		}
		this.obtenerInformacion('obtenerIncidencias', 'incidencias', datos, event);
	}

	async filtros(){
		let componentProps = {fechaInicio: this.fechaInicio, fechaFin: this.fechaFin, estados: this.estados};
		const modal = await this.modalController.create({
			component: FiltrosIncidenciaComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps
		});
		await modal.present();
		modal.onWillDismiss().then(({ data }) => {
			if(data){
				this.listaIncidencias = [];
				document.getElementById("searchFiltro").getElementsByTagName("input")[0].value = '';
				this.buscarLista = '';
				this.fechaInicio = '';
				this.fechaFin = '';
				this.estados = [];
				
				if (data != 'todo'){
					this.fechaInicio = data.desde ? data.desde : '';
					this.fechaFin = data.hasta ? data.hasta : '';
					this.estados = data.estado ? data.estado : [];
				}

				let datos = {
					inicio: 0,
					fin: 12,
					where: this.buscarLista,
					fechaInicio: this.fechaInicio,
					fechaFin: this.fechaFin,
					estado: this.estados
				}

				this.obtenerInformacion('obtenerIncidencias', 'incidencias', datos);
			}
		}, console.error);
	}

}
