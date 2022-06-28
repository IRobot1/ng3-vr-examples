import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { NgtCanvasModule, NgtRadianPipeModule } from '@angular-three/core';
import { NgtBufferAttributeModule, NgtColorAttributeModule } from '@angular-three/core/attributes';
import { NgtGridHelperModule, NgtPointLightHelperModule } from '@angular-three/core/helpers';

import { NgtAmbientLightModule, NgtDirectionalLightModule, NgtPointLightModule } from '@angular-three/core/lights';

import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtLineModule } from '@angular-three/core/lines';

import { NgtBoxGeometryModule, NgtBufferGeometryModule, NgtCircleGeometryModule, NgtConeGeometryModule, NgtCylinderGeometryModule, NgtIcosahedronGeometryModule, NgtPlaneGeometryModule, NgtSphereGeometryModule, NgtTorusGeometryModule  } from '@angular-three/core/geometries';

import { NgtLineBasicMaterialModule, NgtMeshBasicMaterialModule, NgtMeshStandardMaterialModule } from '@angular-three/core/materials';

import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls'
import { NgtSobaTextModule } from '@angular-three/soba/abstractions'
import { NgtSobaSkyModule  } from '@angular-three/soba/staging'

import { NgtCannonDebugModule, NgtPhysicsModule } from '@angular-three/cannon';

import { AppComponent } from './app.component';

import { LineRoomComponent } from '../components/line-room/line-room.componnet';

import { HomeComponent } from './home/home.component';
import { BallshooterExample } from '../examples/ballshooter/ballshooter.component';
import { DraggingExample } from '../examples/dragging/dragging.component';
import { HandInputExample } from '../examples/hand/hand.component';
import { TeleportExample } from '../examples/teleport/teleport.component';
import { BatExample } from '../examples/physics-bat/physics-bat.component';
import { Projectiles } from '../examples/physics-bat/projectiles/projectiles.component';
import { FloorComponent } from '../components/floor.component';
import { Target } from '../examples/physics-bat/target/target.component';
import { XRControllerComponent } from '../examples/xr-controller/xr-controller.component';
import { TeleportDirective } from '../examples/xr-controller/teleport.component';
import { HandinputDirective } from '../examples/hand/handinput.component';
import { ShowControllerDirective } from '../examples/xr-controller/showcontroller.component';
import { TrackedPointerDirective } from '../examples/xr-controller/trackpointer.component';
import { DragDirective } from '../examples/dragging/drag.component';
import { ShootDirective } from '../examples/ballshooter/shoot.component';
import { BatDirective } from '../examples/physics-bat/bat.component';
import { InspectExample } from '../examples/inspect/inspect.component';
import { GrabDirective } from '../examples/inspect/grab.component';
import { InspectCube } from '../examples/inspect/inspect-cube.component';
import { DrumstickExample } from '../examples/drumstick/drumstick.component';
import { DrumKey } from '../examples/drumstick/key.component';
import { DrumstickDirective } from '../examples/drumstick/stick.component';
import { KeyboardComponent } from '../examples/drumstick/keyboard/keyboard.component';
import { TouchpadExample } from '../examples/touchpad/touchpad.component';
import { TouchMoveDirective } from '../examples/touchpad/touchmove.component';
import { JoystickExample } from '../examples/joystick/joystick.component';
import { JoystickhMoveDirective } from '../examples/joystick/joystickmove.component';
import { Room1Example } from '../examples/room1/room1.component';
import { WallComponent } from '../components/wall.component';
import { ShowHandDirective } from '../examples/hand/showhand.component';
import { WebXRDirective } from '../examples/xr-controller/webxr.directive';
import { PanelComponent } from './portal/panel/panel.component';
import { PortalComponent } from './portal/portal.component';
import { NavigateDirective } from './portal/navigate.directive';
import { NavigateHomeDirective } from './portal/navhome.directive';
import { HighlightDirective } from '../examples/xr-controller/highlight.component';
import { BehaviorsExample } from '../examples/behaviors/behaviors.component';

@NgModule({
  declarations: [
    AppComponent,

    HomeComponent,
    PortalComponent,
    PanelComponent,
    NavigateDirective,
    NavigateHomeDirective,

    WebXRDirective,

    LineRoomComponent,
    FloorComponent,

    BallshooterExample,
    ShootDirective,

    DraggingExample,
    DragDirective,

    HandInputExample,
    ShowHandDirective,
    HandinputDirective,

    TeleportExample,
    XRControllerComponent,
    TeleportDirective,
    ShowControllerDirective,
    TrackedPointerDirective,
    HighlightDirective,

    BatExample,
    Projectiles,
    Target,
    BatDirective,

    InspectExample,
    InspectCube,
    GrabDirective,

    DrumstickExample,
    DrumstickDirective,
    DrumKey,
    KeyboardComponent,

    TouchpadExample,
    TouchMoveDirective,

    JoystickExample,
    JoystickhMoveDirective,

    BehaviorsExample,

    Room1Example,
    WallComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // core
    NgtCanvasModule,
    NgtColorAttributeModule,
    NgtBufferAttributeModule,
    NgtRadianPipeModule,

    NgtGridHelperModule,

    NgtAmbientLightModule,
    NgtDirectionalLightModule,

    NgtPointLightModule,
    NgtPointLightHelperModule,

    NgtLineModule,
    NgtMeshModule,
    NgtGroupModule,

    NgtBufferGeometryModule,
    NgtBoxGeometryModule,
    NgtSphereGeometryModule,
    NgtPlaneGeometryModule,
    NgtConeGeometryModule,
    NgtCylinderGeometryModule,
    NgtIcosahedronGeometryModule,
    NgtTorusGeometryModule,
    NgtCircleGeometryModule,

    NgtMeshStandardMaterialModule,
    NgtLineBasicMaterialModule,
    NgtMeshBasicMaterialModule,

    // soba
    NgtSobaOrbitControlsModule,
    NgtSobaTextModule,
    NgtSobaSkyModule,

    // cannon
    NgtPhysicsModule,
    NgtCannonDebugModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
