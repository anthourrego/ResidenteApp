import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { PeticionService } from 'src/app/config/peticiones/peticion.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
	selector: 'app-filtros-pqr',
	templateUrl: './filtros-pqr.component.html',
	styleUrls: ['./filtros-pqr.component.scss'],
})
export class FiltrosPqrComponent implements OnInit {
  	@Input() fechaInicio: string;
	@Input() fechaFin: string;
	@Input() tipoReunion: Array<object>;
	@Input() selectTipoPQR: Array<object> = [];
	formFiltro: FormGroup;
	searching: boolean = true;
	rutaGeneral: string = 'Propietario/PQR/cPQR/';
	maximoFechaDesde = moment().format('YYYY-MM-DD');
	minFechaHasta = moment("0000-01-01", "YYYY-MM-DD").format('YYYY-MM-DD');
	maximoFechaHasta = moment().format('YYYY-MM-DD');

  	constructor(
    	private modalController: ModalController,
		private peticionServices: PeticionService,
		private notificaciones: NotificacionesService,
  	) { }

  	ngOnInit() {
		//this.listaTipoPQR();
		this.formFiltro = new FormGroup({
			desde: new FormControl(this.fechaInicio),
			hasta: new FormControl(this.fechaFin),
			tipoReunion: new FormControl(this.tipoReunion)
		});
	}

	/* async listaTipoPQR(){
		this.searching = true;
		await this.peticionServices.informacion({}, this.rutaGeneral + 'tipoPQR').then(({ success, datos, msg }) => {
			if (success) {
				this.selectTipoPQR = datos;
				this.formFiltro.get("tipoPQR").setValue(this.tipoPQR);
			} else {
				this.notificaciones.notificacion(msg);
			}
			this.searching = false;
		});
	} */


	cerrarModal(datos?) {
		this.modalController.dismiss(datos);
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
		console.log(informacion);
		if (informacion['desde'] != "" || informacion['hasta'] != "" || informacion['tipoReunion']) {
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
