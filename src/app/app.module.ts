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

import { NgtLineBasicMaterialModule, NgtMeshStandardMaterialModule } from '@angular-three/core/materials';

import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls'
import { NgtSobaTextModule } from '@angular-three/soba/abstractions'
import { NgtSobaSkyModule  } from '@angular-three/soba/staging'

import { NgtCannonDebugModule, NgtPhysicsModule } from '@angular-three/cannon';

import { AppComponent } from './app.component';

import { LineRoomComponent } from '../components/line-room/line-room.componnet';

import { HomeComponent } from '../examples/home/home.component';
import { BallshooterExample } from '../examples/ballshooter/ballshooter.component';
import { DraggingExample } from '../examples/dragging/dragging.component';
import { HandInputExample } from '../examples/handinput/handinput.component';
import { TeleportExample } from '../examples/teleport/teleport.component';
import { BatExample } from '../examples/physics-bat/physics-bat.component';
import { Projectiles } from '../examples/physics-bat/projectiles/projectiles.component';
import { FloorComponent } from '../components/floor.component';
import { Target } from '../examples/physics-bat/target/target.component';
import { XRControllerComponent } from '../examples/teleport/xr-controller/xr-controller.component';
import { TeleportDirective } from '../examples/teleport/xr-controller/teleport.component';
import { HandinputDirective } from '../examples/teleport/xr-controller/handinput.component';
import { ShowControllerDirective } from '../examples/teleport/xr-controller/showcontroller.component';
import { ShowHandDirective } from '../examples/teleport/xr-controller/showhand.component';
import { TrackedPointerDirective } from '../examples/teleport/xr-controller/trackpointer.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

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
