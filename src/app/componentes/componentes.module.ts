import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

const componentes = [
	HeaderComponent,
	MenuComponent,
];

@NgModule({
	declarations: componentes,
	imports: [
		CommonModule,
		IonicModule,
		RouterModule
	],
	exports: componentes
})
export class ComponentesModule { }
