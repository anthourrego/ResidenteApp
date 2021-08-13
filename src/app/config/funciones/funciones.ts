import * as moment from "moment";
import { RxFormGroup, RxFormBuilder } from '@rxweb/reactive-form-validators';

export class FuncionesGenerales {

	static ordenar(a, column?: string, orden?: number, b?): number {
		if (column && b && orden) {
			return a[column] > b[column] ? orden : (a[column] < b[column] ? (orden === -1 ? 1 : -1) : 0);
		} else if (column) {
			return a[column] ? 1 : -1;
		}
	}

	static formatearFecha(fecha: string, formato?: string, iso?: boolean): string {
		const valorFecha = moment(fecha);
		if (iso) {
			return valorFecha.toISOString();
		}
		return valorFecha.format(formato ? formato : 'DD/MM/YYYY')
	}

	static crearFormulario(service: any, group?: boolean) {
		let formulario: RxFormGroup;
		if (group) {
			formulario = <RxFormGroup>new RxFormBuilder().group(service);
		} else {
			formulario = <RxFormGroup>new RxFormBuilder().formGroup(service);
		}
		const propiedades: Array<string> = Object.keys(formulario.controls);
		return { formulario, propiedades }
	}

	static formularioTocado(formulario: RxFormGroup) {
		Object.values(formulario.controls).forEach(item => {
			item.markAsTouched();
			if (item['controls']) {
				this.formularioTocado(item as RxFormGroup);
			}
		});
	}

	static rastreo(cambio, programa) {
		const date = new Date();
		let fecha = date.getFullYear() + "-" + date.getDate() + "-" + (date.getMonth() + 1) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		return { fecha, programa, cambio };
	}

}
