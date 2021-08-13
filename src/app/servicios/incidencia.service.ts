import { Injectable } from '@angular/core';
import { prop, required } from '@rxweb/reactive-form-validators';
import { PeticionService } from '../config/peticiones/peticion.service';

@Injectable({
	providedIn: 'root'
})
export class IncidenciaService extends PeticionService {

	private _ItemEquipoId: string;
	private _TipoIncidenciaId: string;
	private _Descripcion: string;
	private _Asunto: string;
	private _Archivos: string;

	constructor() {
		super();
	}

	@required({ message: 'Seleccione el equipo.' })
	public get ItemEquipoId(): string {
		return this._ItemEquipoId;
	}
	public set ItemEquipoId(value: string) {
		this._ItemEquipoId = value;
	}

	@required({ message: 'Seleccione tipo incidencia.' })
	public get TipoIncidenciaId(): string {
		return this._TipoIncidenciaId;
	}
	public set TipoIncidenciaId(value: string) {
		this._TipoIncidenciaId = value;
	}

	@required({ message: 'Escriba una descripción.' })
	public get Descripcion(): string {
		return this._Descripcion;
	}
	public set Descripcion(value: string) {
		this._Descripcion = value;
	}

	@required({ message: 'Escriba un asunto' })
	public get Asunto(): string {
		return this._Asunto;
	}
	public set Asunto(value: string) {
		this._Asunto = value;
	}

	@prop()
	public get Archivos(): string {
		return this._Archivos;
	}
	public set Archivos(value: string) {
		this._Archivos = value;
	}
}
