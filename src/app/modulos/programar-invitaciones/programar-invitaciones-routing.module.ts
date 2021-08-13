import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramarInvitacionesPage } from './programar-invitaciones.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramarInvitacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramarInvitacionesPageRoutingModule {}
