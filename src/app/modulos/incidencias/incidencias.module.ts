import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidenciasPageRoutingModule } from './incidencias-routing.module';

import { IncidenciasPage } from './incidencias.page';
import { RegistrarIncidenciaComponent } from './registrar-incidencia/registrar-incidencia.component';
import { DetalleIncidenciaComponent } from './detalle-incidencia/detalle-incidencia.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { PipesModule } from '../../pipes/pipes.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { ComponentesModule } from '../../componentes/componentes.module';
import { FiltrosIncidenciaComponent } from './filtros-incidencia/filtros-incidencia.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		IncidenciasPageRoutingModule,
		ReactiveFormsModule,
		RxReactiveFormsModule,
		PipesModule,
		IonicSelectableModule,
		ComponentesModule
	],
	declarations: [IncidenciasPage, RegistrarIncidenciaComponent, DetalleIncidenciaComponent, FiltrosIncidenciaComponent]
})
export class IncidenciasPageModule { }
