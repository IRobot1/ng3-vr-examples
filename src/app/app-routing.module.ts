import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BallshooterExample } from '../examples/ballshooter/ballshooter.component';

import { HomeComponent } from '../examples/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'viewer', component: HomeComponent },
  { path: 'ballshooter', component: BallshooterExample },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
