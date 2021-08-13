import { Injectable } from '@angular/core';
import { required } from '@rxweb/reactive-form-validators';
import { PeticionService } from '../config/peticiones/peticion.service';

@Injectable({
	providedIn: 'root'
})
export class LoginService extends PeticionService {

	private _nroDocumento: string;
	private _usuario: string;
	private _conjunto: string;
	private _nombreUsuario: string;
	private _password: string;

	constructor() {
		super();
	}


	@required({ message: 'Ingrese un valor valido.' })
	public get nroDocumento(): string {
		return this._nroDocumento;
	}
	public set nroDocumento(value: string) {
		this._nroDocumento = value;
	}

	@required({ message: 'Seleccione un conjunto.' })
	public get conjunto(): string {
		return this._conjunto;
	}
	public set conjunto(value: string) {
		this._conjunto = value;
	}

	@required({ message: '' })
	public get nombreUsuario(): string {
		return this._nombreUsuario;
	}
	public set nombreUsuario(value: string) {
		this._nombreUsuario = value;
	}

	@required({ message: '' })
	public get usuario(): string {
		return this._usuario;
	}
	public set usuario(value: string) {
		this._usuario = value;
	}

	@required({ message: 'Ingrese la contraseña.' })
	public get password(): string {
		return this._password;
	}
	public set password(value: string) {
		this._password = value;
	}
}
