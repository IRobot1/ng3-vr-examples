import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BallshooterExample } from '../examples/ballshooter/ballshooter.component';
import { DraggingExample } from '../examples/dragging/dragging.component';
import { DrumstickExample } from '../examples/drumstick/drumstick.component';
import { HandInputExample } from '../examples/hand/hand.component';

import { HomeComponent } from '../examples/home/home.component';
import { InspectExample } from '../examples/inspect/inspect.component';
import { JoystickExample } from '../examples/joystick/joystick.component';
import { BatExample } from '../examples/physics-bat/physics-bat.component';
import { Room1Example } from '../examples/room1/room1.component';
import { TeleportExample } from '../examples/teleport/teleport.component';
import { TouchpadExample } from '../examples/touchpad/touchpad.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'viewer', component: HomeComponent },
  { path: 'ballshooter', component: BallshooterExample },
  { path: 'dragging', component: DraggingExample },
  { path: 'handinput', component: HandInputExample },
  { path: 'teleport', component: TeleportExample },
  { path: 'bat', component: BatExample },
  { path: 'inspect', component: InspectExample },
  { path: 'drumstick', component: DrumstickExample },
  { path: 'touchpad', component: TouchpadExample },
  { path: 'joystick', component: JoystickExample },
  { path: 'room1', component: Room1Example },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
