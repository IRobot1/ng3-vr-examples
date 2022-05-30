import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BallshooterExample } from '../examples/ballshooter/ballshooter.component';
import { DraggingExample } from '../examples/dragging/dragging.component';
import { HandInputExample } from '../examples/handinput/handinput.component';

import { HomeComponent } from '../examples/home/home.component';
import { BatExample } from '../examples/physics-bat/physics-bat.component';
import { TeleportExample } from '../examples/teleport/teleport.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'viewer', component: HomeComponent },
  { path: 'ballshooter', component: BallshooterExample },
  { path: 'dragging', component: DraggingExample },
  { path: 'handinput', component: HandInputExample },
  { path: 'teleport', component: TeleportExample },
  { path: 'bat', component: BatExample },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
