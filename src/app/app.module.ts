import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { NgtCanvasModule } from '@angular-three/core';

import { NgtAmbientLightModule } from '@angular-three/core/lights';

import { NgtMeshModule } from '@angular-three/core/meshes';

import { NgtBoxGeometryModule  } from '@angular-three/core/geometries';



import { AppComponent } from './app.component';
import { HomeComponent } from '../examples/home/home.component';

import { NgtColorAttributeModule, NgtVector2AttributeModule } from '@angular-three/core/attributes';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    NgtCanvasModule,
    NgtColorAttributeModule,

    NgtAmbientLightModule,

    NgtMeshModule,

    NgtBoxGeometryModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
