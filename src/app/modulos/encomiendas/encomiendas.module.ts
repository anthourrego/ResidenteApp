import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncomiendasPageRoutingModule } from './encomiendas-routing.module';

import { EncomiendasPage } from './encomiendas.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DetalleEncomiendaComponent } from './detalle-encomienda/detalle-encomienda.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EncomiendasPageRoutingModule,
		ComponentesModule,
		PipesModule,
	],
	declarations: [EncomiendasPage, DetalleEncomiendaComponent]
})
export class EncomiendasPageModule { }
