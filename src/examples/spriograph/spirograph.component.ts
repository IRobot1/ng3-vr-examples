import { AfterViewInit, Component } from "@angular/core";

import { CatmullRomCurve3, MathUtils, Mesh, Object3D, TubeGeometry, Vector3 } from "three";

import { CameraService } from "../../app/camera.service";

@Component({
  templateUrl: './spirograph.component.html'
})
export class SpirographExample implements AfterViewInit {
  arm1!: Object3D;
  arm1length = 0.5;

  arm2!: Object3D;
  arm2length = 0.1;
  arm2factorx = 30;
  arm2factorz = 1;

  changex = true;
  changez = false;

  vectors: Array<Vector3> = [];

  enabled = false;

  constructor(
    private cameraService: CameraService,
  ) {
    this.cameraService.position = [0, 1.5, 1];
    this.cameraService.lookAt = [0, 1.5, 0];
    this.cameraService.fov = 45;


  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.enabled = true;
    }, 500);
  }

  private angle = 0;
  private speed = 90;

  tubemesh!: Mesh;

  tick(tip: Object3D) {
    if (this.enabled) {
      for (let i = 0; i < this.speed; i++) {
        if (this.angle <= 360) {

          this.arm1.rotation.z = -MathUtils.degToRad(this.angle);
          if (this.changex) {
            this.arm2.rotation.x = -MathUtils.degToRad(this.angle) * this.arm2factorx;
          }

          if (this.changez) {
            this.arm2.rotation.z = -MathUtils.degToRad(this.angle) * this.arm2factorz;
          }
          const next = new Vector3();
          next.setFromMatrixPosition(tip.matrixWorld);
          if (this.angle < 360) this.vectors.push(next)

          this.arm1.updateMatrixWorld();

          this.angle += 0.5;
        }
      }
      if (this.angle <= 360) {
        this.tubemesh.geometry.dispose();
        const curve = new CatmullRomCurve3(this.vectors);
        this.tubemesh.geometry = new TubeGeometry(curve, this.vectors.length, 0.01);
      }
      else {
        this.tubemesh.geometry.dispose();
        const curve = new CatmullRomCurve3(this.vectors, true);
        this.tubemesh.geometry = new TubeGeometry(curve, this.vectors.length, 0.01);
        this.enabled = false;
      }
    }
  }
}
