import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

	@Input('titulo') titulo: string;
	verNotificacion: boolean = false;

	constructor(
		private menuController: MenuController,
		private router: Router
	) { }

	ngOnInit() { }

	toggleMenu() {
		this.menuController.open();
	}

	irMiPerfil() {
		this.router.navigateByUrl('modulos/mi-perfil');
	}

}
