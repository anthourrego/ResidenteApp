import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PQRSFPageRoutingModule } from './pqrsf-routing.module';

import { PQRSFPage } from './pqrsf.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AgregarPqrsfrComponent } from './agregar-pqrsfr/agregar-pqrsfr.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { IonicSelectableModule } from 'ionic-selectable';
import { DetallePQRComponent } from './detalle-pqr/detalle-pqr.component';
import { FiltrosPqrComponent } from './filtros-pqr/filtros-pqr.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ComponentesModule,
		IonicModule,
		PQRSFPageRoutingModule,
		PipesModule,
		ReactiveFormsModule,
		RxReactiveFormsModule,
		IonicSelectableModule
	],
	declarations: [PQRSFPage, AgregarPqrsfrComponent, DetallePQRComponent, FiltrosPqrComponent]
})
export class PQRSFPageModule {}
