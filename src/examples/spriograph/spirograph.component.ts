import { make, NgtTriple } from "@angular-three/core";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import GUI from "lil-gui";

import { CatmullRomCurve3, MathUtils, Mesh, Object3D, TubeGeometry, Vector3 } from "three";

import { CameraService } from "../../app/camera.service";

@Component({
  templateUrl: './spirograph.component.html'
})
export class SpirographExample implements OnInit, AfterViewInit {
  position = [0, 2, -1] as NgtTriple;
  arm1!: Object3D;
  arm2!: Object3D;

  vectors: Array<Vector3> = [];

  enabled = false;

  constructor(
    private cameraService: CameraService,
  ) {
    this.cameraService.position = [0, 1.7, 1];
    this.cameraService.lookAt = [0, 1.7, 0];
    this.cameraService.fov = 65;
  }

  public parameters = {
    changex: 1,
    changez: 1,
    animate: 0,
    arm1length: 0.5,
    arm2length: 0.1,
    arm2factorx: 30,
    arm2factorz: 0,
    redraw: () => { this.redraw() }
  };

  public gui!: GUI;
  private origin!: Vector3;

  ngOnInit(): void {
    const gui = new GUI({ width: 300 }).title('Draw Settings');
    gui.add(this.parameters, 'arm1length', 0.1, 1.0, 0.1).name('Arm 1 Length');
    gui.add(this.parameters, 'arm2length', 0.03, 0.4, 0.001).name('Arm 2 Length');
    gui.add(this.parameters, 'changex', 0, 1, 1).name('Allow change along X');
    gui.add(this.parameters, 'arm2factorx', 0, 90, 1).name('Rotations along X');
    gui.add(this.parameters, 'changez', 0, 1, 1).name('Allow change along Z');
    gui.add(this.parameters, 'arm2factorz', 0, 90, 1).name('Rotations along Z');
    gui.add(this.parameters, 'animate', 0, 1, 1).name('Rotation Preview');
    gui.add(this.parameters, 'redraw').name('Redraw');
    this.gui = gui;

    this.origin = make(Vector3, this.position);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.redraw();
    }, 500);
  }

  private redraw() {
    this.angle = 0;
    this.vectors.length = 0;
    this.tubemesh.geometry.dispose();
    this.enabled = true;
  }

  private angle = 0;
  private speed = 90;

  tubemesh!: Mesh;

  tick(tip: Object3D) {
    if (this.enabled) {
      for (let i = 0; i < this.speed; i++) {
        if (this.angle <= 360) {

          this.arm1.rotation.z = -MathUtils.degToRad(this.angle);
          if (this.parameters.changex == 1) {
            this.arm2.rotation.x = -MathUtils.degToRad(this.angle) * this.parameters.arm2factorx;
          }

          if (this.parameters.changez == 1) {
            this.arm2.rotation.z = -MathUtils.degToRad(this.angle) * this.parameters.arm2factorz;
          }
          const next = new Vector3();
          const position = tip.getWorldPosition(next).sub(this.origin)
          if (this.angle < 360) this.vectors.push(position)

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
    if (this.parameters.animate) {
      this.tubemesh.rotation.x = 0;
      this.tubemesh.rotation.y += 0.005;
      this.tubemesh.rotation.z = 0;
    }
  }
  
}
