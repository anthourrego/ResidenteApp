import { Injectable } from '@angular/core';
import { email, maxLength, required } from '@rxweb/reactive-form-validators';
import { PeticionService } from '../config/peticiones/peticion.service';

@Injectable({
	providedIn: 'root'
})
export class MiPerfilService extends PeticionService {

	private _nombre: string;
	private _apellidos: string;
	private _fechanacim: string;
	private _sexo: string;
	private _email: string;
	private _telefono: string;
	private _direccion: string;
	private _ocupacion: string;

	constructor() {
		super();
	}

	@required({ message: 'Ingrese un valor valido.' })
	@maxLength({value: 30, message: 'Maximo 30 caracteres'})
	public get nombre(): string {
		return this._nombre;
	}
	public set nombre(value: string) {
		this._nombre = value;
	}

	@required({ message: 'Ingrese un valor valido.' })
	@maxLength({value: 30, message: 'Maximo 30 caracteres'})
	public get apellidos(): string {
		return this._apellidos;
	}
	public set apellidos(value: string) {
		this._apellidos = value;
	}

	@required({ message: 'Seleccione una fecha.' })
	public get fechanacim(): string {
		return this._fechanacim;
	}
	public set fechanacim(value: string) {
		this._fechanacim = value;
	}

	@required({ message: 'Seleccione un sexo.' })
	public get sexo(): string {
		return this._sexo;
	}
	public set sexo(value: string) {
		this._sexo = value;
	}

	@required({ message: 'Ingrese un valor valido.' })
	@email({ message: 'Ingrese una correo valido.' })
	@maxLength({value: 120, message: 'Maximo 120 caracteres'})
	public get email(): string {
		return this._email;
	}
	public set email(value: string) {
		this._email = value;
	}

	@required({ message: 'Ingrese un telefono valido.' })
	@maxLength({value: 50, message: 'Maximo 50 caracteres'})
	public get telefono(): string {
		return this._telefono;
	}
	public set telefono(value: string) {
		this._telefono = value;
	}

	@required({ message: 'Ingrese una dirección valida.' })
	@maxLength({value: 100, message: 'Maximo 100 caracteres'})
	public get direccion(): string {
		return this._direccion;
	}
	public set direccion(value: string) {
		this._direccion = value;
	}

	@required({ message: 'Ingrese su ocupación.' })
	@maxLength({value: 50, message: 'Maximo 50 caracteres'})
	public get ocupacion(): string {
		return this._ocupacion;
	}
	public set ocupacion(value: string) {
		this._ocupacion = value;
	}

}
