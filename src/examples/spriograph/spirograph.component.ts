import { Component } from "@angular/core";

import { NgtTriple } from "@angular-three/core";
import { Ng3GUI } from "ng3-gui";

import { CameraService } from "../../app/camera.service";

import { TwoArmSpiroComponent } from "./two-arm-spiro/two-arm-spiro.component";

import { Exporter } from "./export";
import { Mesh } from "three";
import { InteractiveObjects } from "../../../projects/ng3-flat-ui/src/public-api";

@Component({
  templateUrl: './spirograph.component.html'
})
export class SpirographExample {
  position = [0.5, 1.5, -1] as NgtTriple;

  twoarm!: TwoArmSpiroComponent;
  filename = 'model';

  selectable = new InteractiveObjects();

  constructor(
    private cameraService: CameraService,
  ) {
    this.cameraService.position = [0, 1.5, 1];
    this.cameraService.lookAt = [0, 1.5, 0];
    this.cameraService.fov = 45;
  }

  public gui!: Ng3GUI;

  private count = 0;
  saveobj() {
    const save = new Exporter()
    save.exportOBJ(this.twoarm.tubemesh.inst, this.filename + this.count);
    this.count++;
  }
  saveglft() {
    const save = new Exporter()
    save.exportGLTF(this.twoarm.tubemesh.inst, this.filename + this.count);
    this.count++;
  }
  saveply() {
    const save = new Exporter()
    save.exportPLY(this.twoarm.tubemesh.inst, this.filename + this.count);
    this.count++;
  }

  ready(twoarm: TwoArmSpiroComponent): void {
    this.twoarm = twoarm;

    const gui = new Ng3GUI({ width: 300 }).settitle('Draw Settings');
    gui.add(this, 'saveobj').name('Save to OBJ');
    gui.add(this, 'saveply').name('Save to PLY');
    //gui.add(this, 'savegltf').name('Save to GLFT');
    gui.add(this.twoarm, 'radius', 0.001, 0.02, 0.001).name('Tube Radius');
    gui.add(this.twoarm, 'arm1length', 0.1, 1.0, 0.1).name('Arm 1 Length');
    gui.add(this.twoarm, 'arm2length', 0.03, 0.4, 0.01).name('Arm 2 Length');
    gui.add(this.twoarm, 'changey').name('Arm1 change along Y');
    gui.add(this.twoarm, 'arm1factory', 0, 90, 1).name('Rotations along Y');
    gui.add(this.twoarm, 'changex').name('Arm2 change along X');
    gui.add(this.twoarm, 'arm2factorx', 0, 90, 1).name('Rotations along X');
    gui.add(this.twoarm, 'changez').name('Arm2 change along Z');
    gui.add(this.twoarm, 'arm2factorz', 0, 90, 1).name('Rotations along Z');
    gui.add(this.twoarm, 'speed', 1, 90, 1).name('Draw Speed');
    gui.addColor(this.twoarm, 'tubecolor').name('Tube Color');
    gui.add(this.twoarm, 'animate').name('Rotate Model');
    gui.add(this.twoarm, 'redraw').name('Redraw');
    this.gui = gui;

    setTimeout(() => {
      twoarm.redraw();
    }, 500);
  }
}
