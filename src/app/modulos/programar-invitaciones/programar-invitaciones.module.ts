import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramarInvitacionesPageRoutingModule } from './programar-invitaciones-routing.module';

import { ProgramarInvitacionesPage } from './programar-invitaciones.page';
import { ComponentesModule } from '../../componentes/componentes.module';
import { AgregarInvitacionComponent } from './agregar-invitacion/agregar-invitacion.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DetalleHistoricoComponent } from './detalle-historico/detalle-historico.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ProgramarInvitacionesPageRoutingModule,
		ComponentesModule,
		ReactiveFormsModule,
		RxReactiveFormsModule, 
		PipesModule
	],
	declarations: [ProgramarInvitacionesPage, AgregarInvitacionComponent, DetalleHistoricoComponent]
})
export class ProgramarInvitacionesPageModule { }
