import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { NgtCanvasModule, NgtRadianPipeModule } from '@angular-three/core';
import { NgtBufferAttributeModule, NgtColorAttributeModule } from '@angular-three/core/attributes';
import { NgtGridHelperModule } from '@angular-three/core/helpers';

import { NgtAmbientLightModule, NgtDirectionalLightModule } from '@angular-three/core/lights';

import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtLineModule } from '@angular-three/core/lines';

import { NgtBoxGeometryModule, NgtBufferGeometryModule, NgtCircleGeometryModule, NgtConeGeometryModule, NgtCylinderGeometryModule, NgtIcosahedronGeometryModule, NgtPlaneGeometryModule, NgtSphereGeometryModule, NgtTorusGeometryModule  } from '@angular-three/core/geometries';

import { NgtLineBasicMaterialModule, NgtMeshStandardMaterialModule } from '@angular-three/core/materials';

import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls'
import { NgtSobaTextModule } from '@angular-three/soba/abstractions'

import { NgtCannonDebugModule, NgtPhysicsModule } from '@angular-three/cannon';

import { AppComponent } from './app.component';

import { LineRoomComponent } from '../components/line-room/line-room.componnet';

import { HomeComponent } from '../examples/home/home.component';
import { BallshooterExample } from '../examples/ballshooter/ballshooter.component';
import { ShootControllerComponent } from '../examples/ballshooter/shoot-controller/shoot-controller.component';
import { DraggingExample } from '../examples/dragging/dragging.component';
import { DraggingControllerComponent } from '../examples/dragging/dragging-controller/dragging-controller.component';
import { HandInputExample } from '../examples/handinput/handinput.component';
import { HandInputControllerComponent } from '../examples/handinput/handinput-controller/handinput-controller.component';
import { TeleportExample } from '../examples/teleport/teleport.component';
import { TeleportControllerComponent } from '../examples/teleport/teleport-controller/teleport-controller.component';
import { BatExample } from '../examples/physics-bat/physics-bat.component';
import { BatController } from '../examples/physics-bat/bat-controller/bat-controller.component';
import { Projectiles } from '../examples/physics-bat/projectiles/projectiles.component';
import { FloorComponent } from '../components/floor.component';
import { Target } from '../examples/physics-bat/target/target.component';
import { XRControllerComponent } from '../examples/teleport/xr-controller/xr-controller.component';
import { TeleportDirective } from '../examples/teleport/xr-controller/teleport.component';
import { HandinputDirective } from '../examples/teleport/xr-controller/handinput.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

    LineRoomComponent,
    FloorComponent,

    BallshooterExample,
    ShootControllerComponent,

    DraggingExample,
    DraggingControllerComponent,

    HandInputExample,
    HandInputControllerComponent,

    TeleportExample,
    TeleportControllerComponent,
    XRControllerComponent,
    TeleportDirective,
    HandinputDirective,

    BatExample,
    BatController,
    Projectiles,
    Target,
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

    // cannon
    NgtPhysicsModule,
    NgtCannonDebugModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
