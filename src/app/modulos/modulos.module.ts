import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulosRoutingModule } from './modulos-routing.module';
import { ComponentesModule } from '../componentes/componentes.module';
import { ModulosComponent } from './modulos.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
	declarations: [ModulosComponent],
	imports: [
		IonicModule,
		ComponentesModule,
		ModulosRoutingModule,
		CommonModule,
	],
})
export class ModulosModule { }
