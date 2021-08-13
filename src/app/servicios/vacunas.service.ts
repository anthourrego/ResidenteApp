import { Injectable } from '@angular/core';
import { prop, required } from '@rxweb/reactive-form-validators';
import * as moment from 'moment';
import { PeticionService } from '../config/peticiones/peticion.service';

@Injectable({
	providedIn: 'root'
})
export class VacunasService extends PeticionService {

	private _Mascota:string; 
	private _Vacuna:string; 
	private _Fecha: string = moment().format('YYYY-MM-DD');

	constructor() {
		super();
	}

	@prop()
	public get Mascota(): string {
		return this._Mascota;
	}
	public set Mascota(value: string) {
		this._Mascota = value;
	}

	@required({ message: 'Escriba el nombre de la vacuna.' })
	public get Vacuna(): string {
		return this._Vacuna;
	}
	public set Vacuna(value: string) {
		this._Vacuna = value;
	}

	@required({ message: 'Seleccione una fecha válida.' })
	public get Fecha(): string {
		return this._Fecha;
	}
	public set Fecha(value: string) {
		this._Fecha = value;
	}

}
