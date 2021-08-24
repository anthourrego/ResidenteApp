import { Injectable } from '@angular/core';
import { PeticionService } from '../config/peticiones/peticion.service';

@Injectable({
	providedIn: 'root'
})
export class EncomiendasService extends PeticionService {

	constructor() {
		super();
	}
}
