import { Injectable } from '@angular/core';
import { prop, required } from '@rxweb/reactive-form-validators';
import { PeticionService } from '../config/peticiones/peticion.service';

@Injectable({
	providedIn: 'root'
})
export class PqrsfService extends PeticionService {

	private _TipoPQR: string;
	private _Asunto: string;
	private _Descripcion: string;
	private _Archivos: string;

	constructor() {
		super();
	}

	@required({ message: 'Seleccione el tipo de PQR.' })
	public get TipoPQR(): string {
		return this._TipoPQR;
	}
	public set TipoPQR(value: string) {
		this._TipoPQR = value;
	}

	@required({ message: 'Escriba un asunto.' })
	public get Asunto(): string {
		return this._Asunto;
	}
	public set Asunto(value: string) {
		this._Asunto = value;
	}

	@required({ message: 'Escriba una descripción.' })
	public get Descripcion(): string {
		return this._Descripcion;
	}
	public set Descripcion(value: string) {
		this._Descripcion = value;
	}

	@prop()
	public get Archivos(): string {
		return this._Archivos;
	}
	public set Archivos(value: string) {
		this._Archivos = value;
	}
}
