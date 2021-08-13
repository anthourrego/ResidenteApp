import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { debounce, distinct } from 'rxjs/operators';
import { ThemeService } from '../servicios/theme.service';

@Component({
	selector: 'app-modulos',
	templateUrl: './modulos.component.html',
	styleUrls: ['./modulos.component.scss'],
})
export class ModulosComponent implements OnInit, AfterViewInit {

	constructor(
		private theme: ThemeService
	) { }

  	ngOnInit() {}

  	ngAfterViewInit() { }

  	detectorDom() {
		const subject = new Subject();
		const observador = new MutationObserver((cambios) => {
			cambios = cambios.filter((elem: any) => (Array.from(elem?.target?.classList) as string[])?.includes('resizable'));
			subject.next(cambios);
		});
		const raiz = document.querySelector('#main-cont');
		if (raiz) {
			observador.observe(raiz as Node, { attributes: true, subtree: true, childList: true, });
		}

		subject.pipe(
			debounce(() => timer(150)),
			distinct()
		).subscribe(() => this.theme.setFontSize(1));
	}
}
