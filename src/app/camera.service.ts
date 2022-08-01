import { Injectable } from "@angular/core";

import { PerspectiveCamera, Vector3 } from "three";
import { make, NgtTriple } from "@angular-three/core";

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  private camera!: PerspectiveCamera;

  set position(newvalue: NgtTriple) {
    this.camera.position.copy(make(Vector3, newvalue));
  }

  set fov(newvalue: number) {
    this.camera.fov = newvalue;
  }

  set near(newvalue: number) {
    this.camera.near = newvalue;
  }

  set far(newvalue: number) {
    this.camera.far = newvalue;
  }

  set lookAt(p: NgtTriple) {
    this.camera.lookAt(p[0], p[1], p[2]);
  }

  start(camera: PerspectiveCamera) {
    this.camera = camera;
    console.warn('started', this.camera)
  }
}
