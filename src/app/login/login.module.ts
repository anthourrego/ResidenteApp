import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		LoginPageRoutingModule,
		ReactiveFormsModule,
		RxReactiveFormsModule,
    	IonicSelectableModule
	],
	declarations: [LoginPage]
})
export class LoginPageModule {}
