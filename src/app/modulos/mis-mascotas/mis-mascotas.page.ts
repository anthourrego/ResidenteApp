import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { PeticionService } from 'src/app/config/peticiones/peticion.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { IonicSelectableComponent } from "ionic-selectable";
import { AgregarMascotaComponent } from './agregar-mascota/agregar-mascota.component';
import { AgregarVacunaComponent } from './agregar-vacuna/agregar-vacuna.component';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-mis-mascotas',
  templateUrl: './mis-mascotas.page.html',
  styleUrls: ['./mis-mascotas.page.scss'],
})
export class MisMascotasPage implements OnInit {

	rutaGeneral: string = 'Propietario/Mascota/cMascota/';
	tipoMascotas: Array<object> = [];
	viviendaTercero: string = '0';
	btnAgregarMascota: boolean = true;
	btnAgregarVacuna: boolean = true;
	mascotas: Array<object> = [];
	vacunas: Array<object> = [];
	searching: boolean = true;
	searchingPro: boolean = false;
	segmento: string = 'mascotas';
	rutaFoto: string = this.peticionServices.url;
	formSelectMascota: FormGroup;
	buscarLista: string = '';

	constructor(
		private modalController: ModalController,
		private peticionServices: PeticionService,
		private notificaciones: NotificacionesService,
	) { }

	ngOnInit() {
		this.listaMascotas();
		this.searching = true;
		this.obtenerTipoMascota();

		this.formSelectMascota = new FormGroup({
			selectMascota: new FormControl('')
		});
	}

	async formularioMascota(datos?, accion = "crear") {
		let componentProps = { datos, accion, tipoMascotas:this.tipoMascotas, vivienda: this.viviendaTercero};
		const modal = await this.modalController.create({
			component: AgregarMascotaComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps
		});
		await modal.present();
		modal.onWillDismiss().then(({data}) => {
			if (data.tipo == 'listar') {
				this.listaMascotas();
				if(accion == "crear"){
					let mascota;
					setTimeout(() => {
						mascota = this.mascotas.find(element => element['id'] == data.id);
						if (mascota) {
							this.segmento = 'vacunas';
							this.formSelectMascota.get("selectMascota").setValue(mascota);
							this.cargarVacunas(mascota.id)
						}
					}, 1200);
				}
			}
		}, console.error);
	}

	async formularioVacuna(accion = "crear") {
		let componentProps = { accion, Mascota: this.formSelectMascota.get('selectMascota').value};
		const modal = await this.modalController.create({
			component: AgregarVacunaComponent,
			backdropDismiss: true,
			cssClass: 'animate__animated animate__slideInRight animate__faster',
			componentProps
		});
		await modal.present();
		modal.onWillDismiss().then(({data}) => {
			if (data == 'listar') {
				this.listaMascotas();
				this.cargarVacunas(this.formSelectMascota.get("selectMascota").value['id']);
			}
		}, console.error);
	}

	async obtenerTipoMascota() {
		this.searching = true;
		this.peticionServices.informacion({}, this.rutaGeneral + 'tipoMascotas').then(({ success, datos, msg }) => {
			if (success) {
				this.tipoMascotas = datos;
				if (this.tipoMascotas.length > 0 && this.viviendaTercero != '0') {
					this.btnAgregarMascota = false;
				} else {
					this.btnAgregarMascota = true;
				}

				if (this.searchingPro) {
					this.searching = false;
				}

			} else {
				this.notificaciones.notificacion(msg);
			}
		});
	}

	async listaMascotas(event?) {
		this.searching = true;
		this.peticionServices.informacion({}, this.rutaGeneral + 'obtenerMascotaTercero').then(({ success, datos, vivienda, msg }) => {
			if (success) {
				this.viviendaTercero = vivienda;
				this.mascotas = datos;
				if (datos.length == 1) {
					this.formSelectMascota.get("selectMascota").setValue(this.mascotas[0]);
					this.cargarVacunas(this.mascotas[0]['id']);
				}
				this.searching = false;
				this.searchingPro = true;
				if(event){
					event.target.complete();
				}
			} else {
				this.notificaciones.notificacion(msg);
			}
		}, console.error);

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

	accionMascota(tipo: string, Mascota: any) {
		switch (tipo) {
			case 'vacuna':
				this.formSelectMascota.get("selectMascota").setValue(Mascota);
				this.cargarVacunas(Mascota.id);
				this.segmento = 'vacunas';
				break;
			case 'editar':
				this.formularioMascota(Mascota, tipo);
				break;
			case 'eliminar':
				this.notificaciones.alerta("¿Desea eliminar la mascota " + Mascota.nombre + "?").then(({ role, data }) => {
					if (role == 'aceptar') {
						this.searching = true;
						this.peticionServices.informacion({ idMascota: Mascota.id, Mascota: Mascota.nombre }, this.rutaGeneral + 'eliminarMascota').then(({ success, msg }) => {
							if (success) {
								this.listaMascotas();
							} else {
								this.notificaciones.notificacion(msg);
								this.searching = false;
							}
						}, console.error);
					}
				});
				break;
			default:
				console.log("EL valor no es valido");
				break;
		}
	}

	accionVacuna(tipo: string, Vacuna: any) {
		if (tipo == 'eliminar') {
			this.notificaciones.alerta("¿Desea eliminar la vacuna " + Vacuna.Vacuna + "?").then(({ role, data }) => {
				if (role == 'aceptar') {
					this.searching = true;
					let mascota = this.formSelectMascota.get('selectMascota');
					this.peticionServices.informacion({ idVacuna: Vacuna.Id, Vacuna: Vacuna.Vacuna, MascotaId: mascota.value['id'], Mascota: mascota.value['nombre'] }, this.rutaGeneral + 'eliminarVacuna').then(({ success, msg }) => {
						if (success) {
							this.cargarVacunas(this.formSelectMascota.get("selectMascota").value['id']);
						} else {
							this.notificaciones.notificacion(msg);
							this.searching = false;
						}
					}, console.error);
				}
			});
		}
	}

	cambioSegmento(ev: any) {
		this.segmento =  ev.detail.value;
	}

	cambioMascota(event: { component: IonicSelectableComponent; value: any }) {
		this.cargarVacunas(event.value.id);	
	}

	async cargarVacunas(mascotaId, event?){
		this.vacunas = [];
		this.searching = true;
		this.peticionServices.informacion({ Id: mascotaId }, this.rutaGeneral + 'cargarVacunas').then(({ success, datos, msg }) => {
			if (success) {
				this.vacunas = datos;
				this.btnAgregarVacuna = false;
			} else {
				this.notificaciones.notificacion(msg);
			}
			this.searching = false;

			if(event){
				event.target.complete();
			}
		}, console.error);
	}

	buscarFiltro(evento) {
		this.buscarLista = evento.detail.value;
	}

	refreshVacunas(event){
		this.cargarVacunas(this.formSelectMascota.get("selectMascota").value['id'], event);
	}
}
