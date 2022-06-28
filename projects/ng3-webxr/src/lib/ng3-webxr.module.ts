import { NgtGroupModule } from '@angular-three/core/group';
import { NgModule } from '@angular/core';
import { HighlightDirective } from './highlight.directive';
import { ShowControllerDirective } from './showcontroller.directive';
import { TeleportDirective } from './teleport.directive';
import { TrackedPointerDirective } from './trackpointer.directive';
import { VRControllerComponent } from './vr-controller.component';
import { WebVRDirective } from './webvr.directive';



@NgModule({
  declarations: [
    HighlightDirective,
    ShowControllerDirective,
    TeleportDirective,
    TrackedPointerDirective,
    VRControllerComponent,
    WebVRDirective,
  ],
  imports: [
    NgtGroupModule,
  ],
  exports: [
    HighlightDirective,
    ShowControllerDirective,
    TeleportDirective,
    TrackedPointerDirective,
    VRControllerComponent,
    WebVRDirective,
  ]
})
export class Ng3WebxrModule { }
