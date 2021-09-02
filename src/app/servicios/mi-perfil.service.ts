import { Injectable } from '@angular/core';
import { email, maxLength, prop, required } from '@rxweb/reactive-form-validators';
import { PeticionService } from '../config/peticiones/peticion.service';

@Injectable({
	providedIn: 'root'
})
export class MiPerfilService extends PeticionService {

	private _nombruno: string;
	private _nombrdos: string;
	private _apelluno: string;
	private _apelldos: string;
	private _fechanacim: string;
	private _sexo: string;
	private _email: string;
	private _email2: string;
	private _celular: string;
	private _telefono: string;
	private _direccion: string;
	private _ocupacion: string;
	private _estadocivilid: string;
	private _numercredi: string;
	private _ciudadid: string;
	private _dptoid: string;
	private _paisid: string;
	private _barrioid: string;
	private _zonaid: string;
	private _direccorre: string;
	private _ciudacorre: string;
	private _dptocorre: string;
	private _paiscorre: string;
	private _barricorre: string;
	private _telefcorre: string;

	constructor() {
		super();
	}

	@required({ message: 'Campo requerido.' })
	@maxLength({ value: 30, message: 'Maximo 30 caracteres' })
	public get nombruno(): string {
		return this._nombruno;
	}
	public set nombruno(value: string) {
		this._nombruno = value;
	}

	@maxLength({ value: 30, message: 'Maximo 30 caracteres' })
	public get nombrdos(): string {
		return this._nombrdos;
	}
	public set nombrdos(value: string) {
		this._nombrdos = value;
	}

	@required({ message: 'Campo requerido.' })
	@maxLength({ value: 30, message: 'Maximo 30 caracteres' })
	public get apelluno(): string {
		return this._apelluno;
	}
	public set apelluno(value: string) {
		this._apelluno = value;
	}

	@maxLength({ value: 30, message: 'Maximo 30 caracteres' })
	public get apelldos(): string {
		return this._apelldos;
	}
	public set apelldos(value: string) {
		this._apelldos = value;
	}

	@prop()
	public get sexo(): string {
		return this._sexo;
	}
	public set sexo(value: string) {
		this._sexo = value;
	}

	@prop()
	public get fechanacim(): string {
		return this._fechanacim;
	}
	public set fechanacim(value: string) {
		this._fechanacim = value;
	}

	@email({ message: 'Ingrese una correo valido.' })
	@maxLength({ value: 120, message: 'Maximo 120 caracteres' })
	public get email(): string {
		return this._email;
	}
	public set email(value: string) {
		this._email = value;
	}

	@email({ message: 'Ingrese una correo valido.' })
	@maxLength({ value: 120, message: 'Maximo 120 caracteres' })
	public get email2(): string {
		return this._email2;
	}
	public set email2(value: string) {
		this._email2 = value;
	}

	@maxLength({ value: 50, message: 'Maximo 50 caracteres' })
	public get celular(): string {
		return this._celular;
	}
	public set celular(value: string) {
		this._celular = value;
	}

	@prop()
	public get estadocivilid(): string {
		return this._estadocivilid;
	}
	public set estadocivilid(value: string) {
		this._estadocivilid = value;
	}

	@prop()
	@maxLength({ value: 20, message: 'Maximo 20 caracteres' })
	public get numercredi(): string {
		return this._numercredi;
	}
	public set numercredi(value: string) {
		this._numercredi = value;
	}

	@prop()
	@maxLength({ value: 50, message: 'Maximo 50 caracteres' })
	public get ocupacion(): string {
		return this._ocupacion;
	}
	public set ocupacion(value: string) {
		this._ocupacion = value;
	}

	@prop()
	@maxLength({ value: 100, message: 'Maximo 100 caracteres' })
	public get direccion(): string {
		return this._direccion;
	}
	public set direccion(value: string) {
		this._direccion = value;
	}

	@prop()
	public get ciudadid(): string {
		return this._ciudadid;
	}
	public set ciudadid(value: string) {
		this._ciudadid = value;
	}

	@prop()
	public get dptoid(): string {
		return this._dptoid;
	}
	public set dptoid(value: string) {
		this._dptoid = value;
	}

	@prop()
	public get paisid(): string {
		return this._paisid;
	}
	public set paisid(value: string) {
		this._paisid = value;
	}

	@prop()
	public get barrioid(): string {
		return this._barrioid;
	}
	public set barrioid(value: string) {
		this._barrioid = value;
	}

	@prop()
	public get zonaid(): string {
		return this._zonaid;
	}
	public set zonaid(value: string) {
		this._zonaid = value;
	}

	@maxLength({ value: 50, message: 'Maximo 50 caracteres' })
	public get telefono(): string {
		return this._telefono;
	}
	public set telefono(value: string) {
		this._telefono = value;
	}

	@prop()
	@maxLength({ value: 100, message: 'Maximo 100 caracteres' })
	public get direccorre(): string {
		return this._direccorre;
	}
	public set direccorre(value: string) {
		this._direccorre = value;
	}

	@prop()
	public get ciudacorre(): string {
		return this._ciudacorre;
	}
	public set ciudacorre(value: string) {
		this._ciudacorre = value;
	}

	@prop()
	public get dptocorre(): string {
		return this._dptocorre;
	}
	public set dptocorre(value: string) {
		this._dptocorre = value;
	}

	@prop()
	public get paiscorre(): string {
		return this._paiscorre;
	}
	public set paiscorre(value: string) {
		this._paiscorre = value;
	}

	@prop()
	public get barricorre(): string {
		return this._barricorre;
	}
	public set barricorre(value: string) {
		this._barricorre = value;
	}

	@maxLength({ value: 50, message: 'Maximo 50 caracteres' })
	public get telefcorre(): string {
		return this._telefcorre;
	}
	public set telefcorre(value: string) {
		this._telefcorre = value;
	}

}
