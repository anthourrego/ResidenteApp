import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiPerfilPageRoutingModule } from './mi-perfil-routing.module';

import { MiPerfilPage } from './mi-perfil.page';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { ComponentesModule } from '../../componentes/componentes.module';
import { PipesModule } from '../../pipes/pipes.module';
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		RxReactiveFormsModule,
		MiPerfilPageRoutingModule,
		ComponentesModule,
		PipesModule
	],
	declarations: [MiPerfilPage],
	providers: [Camera]
})
export class MiPerfilPageModule { }
