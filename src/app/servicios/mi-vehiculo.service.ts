import { Injectable } from '@angular/core';
import { prop, required } from '@rxweb/reactive-form-validators';
import { PeticionService } from '../config/peticiones/peticion.service';

@Injectable({
	providedIn: 'root'
})
export class MiVehiculoService extends PeticionService {

	private _TerceroID: string;
	private _TipoVehiculoID: string;
	private _Placa: string;
	private _Marca: string;
	private _Modelo: string;
	private _Color: string;
	private _Cilindraje: string;

	constructor() {
		super();
	}

	@required({ message: 'Seleccione el tipo de vehiculo.' })
	public get TipoVehiculoID(): string {
		return this._TipoVehiculoID;
	}
	public set TipoVehiculoID(value: string) {
		this._TipoVehiculoID = value;
	}

	@required({ message: 'Ingrese una placa valida.' })
	public get Placa(): string {
		return this._Placa;
	}
	public set Placa(value: string) {
		this._Placa = value;
	}

	@prop()
	public get Marca(): string {
		return this._Marca;
	}
	public set Marca(value: string) {
		this._Marca = value;
	}

	@prop()
	public get Modelo(): string {
		return this._Modelo;
	}
	public set Modelo(value: string) {
		this._Modelo = value;
	}

	@prop()
	public get Color(): string {
		return this._Color;
	}
	public set Color(value: string) {
		this._Color = value;
	}

	@prop()
	public get Cilindraje(): string {
		return this._Cilindraje;
	}
	public set Cilindraje(value: string) {
		this._Cilindraje = value;
	}

}
