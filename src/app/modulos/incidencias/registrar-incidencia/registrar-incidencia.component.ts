import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RxFormGroup } from '@rxweb/reactive-form-validators';
import { FuncionesGenerales } from 'src/app/config/funciones/funciones';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { IncidenciaService } from '../../../servicios/incidencia.service';

@Component({
	selector: 'app-registrar-incidencia',
	templateUrl: './registrar-incidencia.component.html',
	styleUrls: ['./registrar-incidencia.component.scss'],
})
export class RegistrarIncidenciaComponent implements OnInit {

	@Input() datos: object;
	@Input() equipos: Array<object>;
	@Input() tiposIncidencias: Array<object>;
	datosFormulario: { formulario: RxFormGroup, propiedades: Array<string> };
	rutaGeneral: string = 'Propietario/Incidencia/cIncidencia/';
	private file: File;
	nombreInputFile: string = "Seleccionar Archivo";

	constructor(
		private modalController: ModalController,
		private incidenciaService: IncidenciaService,
		private notifcaciones: NotificacionesService,
	) { }

	ngOnInit() {
		this.configForm();
		if (this.datos) {
			this.datosFormulario.formulario.patchModelValue(this.datos);
		}
	}

	configForm() {
		this.datosFormulario = FuncionesGenerales.crearFormulario(this.incidenciaService);
	}

	cerrarModal(accion?) {
		this.datosFormulario.formulario.reset();
		this.modalController.dismiss(accion);
	}

	async guardarIncidencia() {
		if (this.datosFormulario.formulario.valid) {
			const informacion = Object.assign({}, this.datosFormulario.formulario.value);
			informacion['TipoIncidenciaId'] = informacion['TipoIncidenciaId'].TipoIncidenciaId;
			informacion['ItemEquipoId'] = informacion['ItemEquipoId'].ItemEquipoId;
			if (this.file) {
				informacion['Archivos'] = await this.getBase64(this.file);
				informacion['ArchivoNombre'] = this.file.name;
				informacion['TipoArchivo'] = this.file.type;
			} else {
				informacion['Archivos'] = ''
			}
			this.incidenciaService.informacion(informacion, this.rutaGeneral + 'crear').then(({ msg, success, datos }) => {
				this.notifcaciones.notificacion(msg);
				if (success) {
					this.cerrarModal('listar');
				} else {
				}
			}, console.error);
		} else {
			FuncionesGenerales.formularioTocado(this.datosFormulario.formulario);
		}
	}

	onFileChange(event) {
		this.file = event.target.files[0];
		if (this.file) {
			this.nombreInputFile = this.file.name;
		} else {
			this.nombreInputFile = 'Seleccionar Archivo';
		}
	}

	getBase64(file) {
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
