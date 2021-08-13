import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutorizarVisitantesPageRoutingModule } from './autorizar-visitantes-routing.module';

import { AutorizarVisitantesPage } from './autorizar-visitantes.page';
import { ComponentesModule } from '../../componentes/componentes.module';
import { AgregarVisitanteComponent } from './agregar-visitante/agregar-visitante.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutorizarVisitantesPageRoutingModule,
    ComponentesModule,
    PipesModule,
    ReactiveFormsModule,
    RxReactiveFormsModule
  ],
  declarations: [AutorizarVisitantesPage, AgregarVisitanteComponent],
  providers: [Camera]
})
export class AutorizarVisitantesPageModule { }
