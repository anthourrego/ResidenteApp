import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { CustomInjectorService } from './config/peticiones/peticion.service';
import { IonicSelectableModule } from 'ionic-selectable';
import { ComponentesModule } from './componentes/componentes.module';

@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [
		BrowserModule, 
		IonicModule.forRoot(), 
		AppRoutingModule,
		HttpClientModule,
		IonicStorageModule.forRoot({
			name: '__residenteDB',
			driverOrder: ['indexeddb', 'sqlite', 'websql'],
			storeName: 'settings',
			description: 'ResidenteApp temp data'
		}),
		IonicSelectableModule,
		ComponentesModule
	],
	providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor(private injector: Injector) {
		if (!CustomInjectorService.injector) {
			CustomInjectorService.injector = this.injector;
		}
	}

}
