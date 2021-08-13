import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PeticionService } from 'src/app/config/peticiones/peticion.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { IonicSelectableComponent } from "ionic-selectable";
import * as moment from 'moment';
import { Data } from '@angular/router';

@Component({
	selector: 'app-filtros-incidencia',
	templateUrl: './filtros-incidencia.component.html',
	styleUrls: ['./filtros-incidencia.component.scss'],
})
export class FiltrosIncidenciaComponent implements OnInit {
	@Input() fechaInicio: string;
	@Input() fechaFin: string;
	@Input() estados: Array<object>;
	formFiltro: FormGroup;
	searching: boolean = true;
	rutaGeneral: string = 'Propietario/Incidencia/cIncidencia/';
	selectEstados: Array<object> = [];
	maximoFechaDesde = moment().format('YYYY-MM-DD');
	minFechaHasta = moment("0000-01-01", "YYYY-MM-DD").format('YYYY-MM-DD');
	maximoFechaHasta = moment().format('YYYY-MM-DD');

  	constructor(
		private modalController: ModalController,
		private peticionServices: PeticionService,
		private notificaciones: NotificacionesService,
	) { }

	ngOnInit() {
		this.listaEstados();
		this.formFiltro = new FormGroup({
			desde: new FormControl(this.fechaInicio),
			hasta: new FormControl(this.fechaFin),
			estado: new FormControl(this.estados)
		});
	}

	cerrarModal(datos?) {
		this.modalController.dismiss(datos);
	}

	async listaEstados(){
		this.searching = true;
		await this.peticionServices.informacion({}, this.rutaGeneral + 'listaEstado').then(({ success, datos, msg }) => {
			if (success) {
				this.selectEstados = datos;
				this.formFiltro.get("estado").setValue(this.estados);
			} else {
				this.notificaciones.notificacion(msg);
			}
			this.searching = false;
		});
	}

	cambioFechaDesde($event){
		this.minFechaHasta = $event;
	}

	cambioFechaHasta($event){
		this.maximoFechaDesde = $event;
	}

	filtrar(){
		let filtra = true;
		const informacion = Object.assign({}, this.formFiltro.value);
		if (informacion['desde'] || informacion['hasta'] || informacion['estado']) {
			if (informacion['desde'] && informacion['hasta']) {
				informacion['hasta'] = moment(informacion['hasta']).format('YYYY-MM-DD');
				informacion['desde'] = moment(informacion['desde']).format('YYYY-MM-DD');
			} else {
				if (informacion['hasta'] || informacion['desde']) {
					filtra = false
				}
			}
			if (informacion['desde'] <= informacion['hasta'] && filtra) {
				this.cerrarModal(informacion);
			} else {
				this.notificaciones.notificacion("Ingrese un rango de fechas valido.");
			}
		} else {
			this.notificaciones.notificacion("Ingrese algún filtro.");
		}
	}

	formReset(){
		this.formFiltro.reset();
		this.maximoFechaDesde = moment().format('YYYY-MM-DD');
		this.minFechaHasta = moment("0000-01-01", "YYYY-MM-DD").format('YYYY-MM-DD');
		this.maximoFechaHasta = moment().format('YYYY-MM-DD');
	}
}
