import { NgModule } from '@angular/core';

import { NgtGroupModule } from '@angular-three/core/group';

import { HighlightDirective } from './vr/highlight.directive';
import { ShowControllerDirective } from './vr/showcontroller.directive';
import { TeleportDirective } from './vr/teleport.directive';
import { TrackedPointerDirective } from './vr/trackpointer.directive';
import { VRControllerComponent } from './vr/vr-controller.component';
import { WebVRDirective } from './vr/webvr.directive';

import { ARControllerComponent } from './ar/ar-controller.component';
import { WebARDirective } from './ar/webar.directive';
import { ARGesturesComponent } from './ar/ar-gestures.component';
import { GUIPointerDirective } from './vr/guipointer.directive';


@NgModule({
  declarations: [
    GUIPointerDirective,
    HighlightDirective,
    ShowControllerDirective,
    TeleportDirective,
    TrackedPointerDirective,
    VRControllerComponent,
    WebVRDirective,

    ARControllerComponent,
    ARGesturesComponent,
    WebARDirective,
  ],
  imports: [
    NgtGroupModule,
  ],
  exports: [
    GUIPointerDirective,
    HighlightDirective,
    ShowControllerDirective,
    TeleportDirective,
    TrackedPointerDirective,
    VRControllerComponent,
    WebVRDirective,

    ARControllerComponent,
    ARGesturesComponent,
    WebARDirective,
  ]
})
export class Ng3WebxrModule { }
