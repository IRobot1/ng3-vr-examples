import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { NgtCanvasModule } from '@angular-three/core';
import { NgtColorAttributeModule } from '@angular-three/core/attributes';

import { NgtAmbientLightModule, NgtDirectionalLightModule } from '@angular-three/core/lights';

import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtGroupModule } from '@angular-three/core/group';

import { NgtBoxGeometryModule, NgtSphereGeometryModule  } from '@angular-three/core/geometries';

import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';

import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls'

import { AppComponent } from './app.component';

import { LineRoomComponent } from '../components/line-room/line-room.componnet';

import { HomeComponent } from '../examples/home/home.component';
import { BallshooterExample } from '../examples/ballshooter/ballshooter.component';
import { ShootControllerComponent } from '../examples/ballshooter/shoot-controller/shoot-controller.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

    LineRoomComponent,

    BallshooterExample,
    ShootControllerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    NgtCanvasModule,
    NgtColorAttributeModule,

    NgtAmbientLightModule,
    NgtDirectionalLightModule,

    NgtMeshModule,
    NgtGroupModule,

    NgtBoxGeometryModule,
    NgtSphereGeometryModule,

    NgtMeshStandardMaterialModule,

    NgtSobaOrbitControlsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
