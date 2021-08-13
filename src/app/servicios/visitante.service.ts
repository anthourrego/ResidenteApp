import { Injectable } from '@angular/core';
import { prop, required } from '@rxweb/reactive-form-validators';
import * as moment from 'moment';
import { PeticionService } from '../config/peticiones/peticion.service';

@Injectable({
	providedIn: 'root'
})
export class VisitanteService extends PeticionService {

	private _Cedula: string;
	private _TipoVehiculoId: string;
	private _Placa: string;
	private _Nombre: string;
	private _Observacion: string;
	private _Estado: string = 'A';
	private _Tipo: string = 'A';
	private _Fecha: string = moment().format('YYYY-MM-DD');

	constructor() {
		super();
	}

	@required({ message: 'Cedula es requerido.' })
	public get Cedula(): string {
		return this._Cedula;
	}
	public set Cedula(value: string) {
		this._Cedula = value;
	}

	@prop()
	public get TipoVehiculoId(): string {
		return this._TipoVehiculoId;
	}
	public set TipoVehiculoId(value: string) {
		this._TipoVehiculoId = value;
	}

	@required({ message: 'Placa es requerido.' })
	public get Placa(): string {
		return this._Placa;
	}
	public set Placa(value: string) {
		this._Placa = value;
	}

	@required({ message: 'Nombre es requerido.' })
	public get Nombre(): string {
		return this._Nombre;
	}
	public set Nombre(value: string) {
		this._Nombre = value;
	}

	@prop()
	public get Observacion(): string {
		return this._Observacion;
	}
	public set Observacion(value: string) {
		this._Observacion = value;
	}

	@prop()
	public get Estado(): string {
		return this._Estado;
	}
	public set Estado(value: string) {
		this._Estado = value;
	}

	@prop()
	public get Tipo(): string {
		return this._Tipo;
	}
	public set Tipo(value: string) {
		this._Tipo = value;
	}

	@required({ message: 'Seleccione una fecha válida.' })
	public get Fecha(): string {
		return this._Fecha;
	}
	public set Fecha(value: string) {
		this._Fecha = value;
	}

}
