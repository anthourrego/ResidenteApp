import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RxFormGroup } from '@rxweb/reactive-form-validators';
import { FuncionesGenerales } from 'src/app/config/funciones/funciones';
import { PqrsfService } from 'src/app/servicios/pqrsf.service';
import { IonicSelectableComponent } from "ionic-selectable";
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { StorageService } from 'src/app/servicios/storage.service';
import { rendererTypeName } from '@angular/compiler';

@Component({
  	selector: 'app-agregar-pqrsfr',
  	templateUrl: './agregar-pqrsfr.component.html',
  	styleUrls: ['./agregar-pqrsfr.component.scss'],
})
export class AgregarPqrsfrComponent implements OnInit {

	@Input() accion: string;
	@Input() tipoPQR: Array<object>;
	datosFormulario: { formulario: RxFormGroup, propiedades: Array<string> };
	searching: boolean = false;
	rutaGeneral: string = 'Propietario/PQR/cPQR/';
	nombreInputFile: string = "Seleccionar Archivo";
	private file: File;


	constructor(
		private modalController: ModalController,
		private servicePQRSF: PqrsfService,
		private notificaciones: NotificacionesService,
		private storage: StorageService
	) {}

	ngOnInit() {
		this.configForm();
	}

  	cerrarModal(datos?) {
		this.datosFormulario.formulario.reset();
		this.modalController.dismiss(datos);
	}

	configForm() {
		this.datosFormulario = FuncionesGenerales.crearFormulario(this.servicePQRSF);
	}

	async guardarPQR() {
		this.searching = true;
		if (this.datosFormulario.formulario.valid) {
			const informacion = Object.assign({}, this.datosFormulario.formulario.value);
			informacion['TipoPQR'] = informacion['TipoPQR'].TipoPQRId; 
			if (this.file) {
				informacion['Archivos'] = await this.getBase64(this.file);
				informacion['ArchivoNombre'] = this.file.name;
				informacion['TipoArchivo'] = this.file.type;
			} else {
				informacion['Archivos'] = ''
			}
			await this.servicePQRSF.informacion(informacion, this.rutaGeneral + 'guardarPQR').then(resp => {
				if (resp.success) {
					this.cerrarModal('listar');
					this.notificaciones.notificacion("PQR registrada con exito, Nro: " + resp.datos[1]);
				} else {
					this.notificaciones.notificacion(resp.msg);
				}
			}, console.error);
		} else {
			FuncionesGenerales.formularioTocado(this.datosFormulario.formulario);
		}
		this.searching = false;
	}

	onFileChange(event){
		this.file = event.target.files[0];
		if (this.file) {
			this.nombreInputFile = this.file.name;
		} else {
			this.nombreInputFile = 'Seleccionar Archivo';
		}
	}

	getBase64(file){
		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
				resolve(reader.result);
			}
			reader.onerror = function (error) {
				reject(error);
			}
		});
	}


}
