import { Injectable } from '@angular/core';
import { maxNumber, minNumber, prop, required } from '@rxweb/reactive-form-validators';
import { PeticionService } from '../config/peticiones/peticion.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MiMascotaService extends PeticionService {

  	private _TipoMascotaId: string;
	private _Nombre: string;
	private _Raza: string;
	private _Sexo: string;
	private _Tamano: string = '0';
	private _FechaNac: string = moment().format('YYYY-MM-DD');
	private _Observacion: string;

  	constructor() {
		super();
	}

	@required({ message: 'Seleccione el tipo de mascota.' })
	public get TipoMascotaId(): string {
		return this._TipoMascotaId;
	}
	public set TipoMascotaId(value: string) {
		this._TipoMascotaId = value;
	}

	@required({ message: 'Ingrese un nombre.' })
	public get Nombre(): string {
		return this._Nombre;
	}
	public set Nombre(value: string) {
		this._Nombre = value;
	}

	@prop()
	public get Raza(): string {
		return this._Raza;
	}
	public set Raza(value: string) {
		this._Raza = value;
	}

	@required({ message: 'Seleccione un sexo.' })
	public get Sexo(): string {
		return this._Sexo;
	}
	public set Sexo(value: string) {
		this._Sexo = value;
	}

	@prop()
	@maxNumber({value: 9.99, message: 'El tamaño maximo es de 9.99.'})
	@minNumber({value: 0.00, message: 'El tamaño minimo es de 0.00.'})
	public get Tamano(): string {
		return this._Tamano;
	}
	public set Tamano(value: string) {
		this._Tamano = value;
	}

	@required({ message: 'Seleccione una fecha de nacimineto válida.' })
	public get FechaNac(): string {
		return this._FechaNac;
	}
	public set FechaNac(value: string) {
		this._FechaNac = value;
	}

	@prop()
	public get Observacion(): string {
		return this._Observacion;
	}
	public set Observacion(value: string) {
		this._Observacion = value;
	}
}
