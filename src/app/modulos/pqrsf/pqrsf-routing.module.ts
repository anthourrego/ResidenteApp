import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PQRSFPage } from './pqrsf.page';

const routes: Routes = [
  {
    path: '',
    component: PQRSFPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PQRSFPageRoutingModule {}
