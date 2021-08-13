import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisVehiculosPageRoutingModule } from './mis-vehiculos-routing.module';

import { MisVehiculosPage } from './mis-vehiculos.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { AgregarVehiculoComponent } from './agregar-vehiculo/agregar-vehiculo.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ComponentesModule,
		IonicModule,
		MisVehiculosPageRoutingModule,
		PipesModule,
		ReactiveFormsModule,
		RxReactiveFormsModule
	],
	declarations: [MisVehiculosPage, AgregarVehiculoComponent]
})
export class MisVehiculosPageModule { }
