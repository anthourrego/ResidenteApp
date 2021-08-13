import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizarVisitantesPage } from './autorizar-visitantes.page';

const routes: Routes = [
  {
    path: '',
    component: AutorizarVisitantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutorizarVisitantesPageRoutingModule {}
