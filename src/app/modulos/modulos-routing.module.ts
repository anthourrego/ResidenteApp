import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: 'inicio',
		loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioPageModule),
	},
	{
		path: 'configuracion',
		loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionPageModule)
	},
	{
		path: 'mis-vehiculos',
		loadChildren: () => import('./mis-vehiculos/mis-vehiculos.module').then(m => m.MisVehiculosPageModule)
	},
	{
		path: 'mis-mascotas',
		loadChildren: () => import('./mis-mascotas/mis-mascotas.module').then(m => m.MisMascotasPageModule)
	},
	{
		path: 'autorizar-visitantes',
		loadChildren: () => import('./autorizar-visitantes/autorizar-visitantes.module').then(m => m.AutorizarVisitantesPageModule)
	},
	{
		path: 'programar-invitaciones',
		loadChildren: () => import('./programar-invitaciones/programar-invitaciones.module').then(m => m.ProgramarInvitacionesPageModule)
	},
	{
		path: 'pqrsf',
		loadChildren: () => import('./pqrsf/pqrsf.module').then(m => m.PQRSFPageModule)
	},
	{
		path: 'incidencias',
		loadChildren: () => import('./incidencias/incidencias.module').then(m => m.IncidenciasPageModule)
	},
	{
		path: 'servicios',
		loadChildren: () => import('./servicios/servicios.module').then(m => m.ServiciosPageModule)
	},
	{
		path: 'encomiendas',
		loadChildren: () => import('./encomiendas/encomiendas.module').then(m => m.EncomiendasPageModule)
	},
	{
		path: 'mi-perfil',
		loadChildren: () => import('./mi-perfil/mi-perfil.module').then(m => m.MiPerfilPageModule)
	}

]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ModulosRoutingModule { }
