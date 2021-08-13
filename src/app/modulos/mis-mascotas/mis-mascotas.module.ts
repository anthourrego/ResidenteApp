import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisMascotasPageRoutingModule } from './mis-mascotas-routing.module';

import { MisMascotasPage } from './mis-mascotas.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { AgregarMascotaComponent } from './agregar-mascota/agregar-mascota.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
import { AgregarVacunaComponent } from './agregar-vacuna/agregar-vacuna.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ComponentesModule,
		IonicModule,
		MisMascotasPageRoutingModule,
		PipesModule,
		ReactiveFormsModule,
		RxReactiveFormsModule,
		IonicSelectableModule
	],
	declarations: [MisMascotasPage, AgregarMascotaComponent, AgregarVacunaComponent],
	providers: [Camera],
})
export class MisMascotasPageModule {}
