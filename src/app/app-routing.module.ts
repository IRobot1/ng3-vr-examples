import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { BallshooterExample } from '../examples/ballshooter/ballshooter.component';
import { DraggingExample } from '../examples/dragging/dragging.component';
import { DrumstickExample } from '../examples/drumstick/drumstick.component';
import { HandInputExample } from '../examples/hand/hand.component';
import { InspectExample } from '../examples/inspect/inspect.component';
import { JoystickExample } from '../examples/joystick/joystick.component';
import { BatExample } from '../examples/physics-bat/physics-bat.component';
import { Room1Example } from '../examples/room1/room1.component';
import { TeleportExample } from '../examples/teleport/teleport.component';
import { TouchpadExample } from '../examples/touchpad/touchpad.component';
import { BehaviorsExample } from '../examples/behaviors/behaviors.component';
import { StudioExample } from '../examples/studio/studio.component';
import { PaintExample } from '../examples/paint/paint.component';
import { HTMLGUIExample } from '../examples/htmlgui/htmlgui.component';
import { ScaleExample } from '../examples/scale/scale.component';
import { ButtonsExample } from '../examples/buttons/buttons.component';
import { MorphWallExample } from '../examples/morphwall/morphwall.component';
import { NetworkExample } from '../examples/network/network.component';
import { SpirographExample } from '../examples/spriograph/spirograph.component';

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
  { path: 'behaviors', component: BehaviorsExample },
  { path: 'room1', component: Room1Example },
  { path: 'studio', component: StudioExample },
  { path: 'paint', component: PaintExample },
  { path: 'htmlgui', component: HTMLGUIExample },
  { path: 'scale', component: ScaleExample },
  { path: 'buttons', component: ButtonsExample },
  { path: 'morphwall', component: MorphWallExample },
  { path: 'network', component: NetworkExample },
  { path: 'spirograph', component: SpirographExample },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
