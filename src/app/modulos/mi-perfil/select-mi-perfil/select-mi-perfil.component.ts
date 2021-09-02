import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { RxFormGroup } from '@rxweb/reactive-form-validators';

@Component({
	selector: 'app-select-mi-perfil',
	templateUrl: './select-mi-perfil.component.html',
	styleUrls: ['./select-mi-perfil.component.scss'],
})
export class SelectMiPerfilComponent implements OnInit, OnChanges {

	@Input() lista: Array<any> = [];
	@Input() valueField: string = '';
	@Input() formControlSelect: string = '';
	@Input() textField: string = '';
	@Input() title: string = '';
	@Input() formulario: RxFormGroup;
	@Input() cambiovalor: boolean;
	@Output() valorSelect = new EventEmitter();
	valorCampo;

	constructor() { }

	ngOnInit() { }

	ngOnChanges() {
		if (this.lista && this.lista.length) {
			let enc = this.lista.find(it => it[this.valueField] == this.formulario.get(this.formControlSelect).value);
			if (enc) this.valorCampo = enc;
		}
	}

	cambioConjunto(event) {
		this.valorCampo = null;
		this.valorSelect.emit({ valor: event.value, key: this.valueField, control: this.formControlSelect });
	}

}
