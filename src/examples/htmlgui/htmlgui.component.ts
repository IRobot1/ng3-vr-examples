import { Component, OnInit } from "@angular/core";

import { Mesh } from "three";
import { Ng3GUI } from "ng3-gui";

import { CameraService } from "../../app/camera.service";


@Component({
  templateUrl: './htmlgui.component.html',
})
export class HTMLGUIExample implements OnInit {
  public parameters = {
    radius: 0.6,
    tube: 0.2,
    tubularSegments: 150,
    radialSegments: 20,
    p: 2,
    q: 3
  };

  public gui!: Ng3GUI;
  public meshes: Array<Mesh> = [];

  constructor(
    private camera: CameraService,
  ) {
    this.camera.position = [0, 1, 0];
    this.camera.lookAt = [-1, 1, -3];
    this.camera.fov = 55;


  }

  ngOnInit(): void {
    const gui = new Ng3GUI({ width: 300 });
    gui.add(this.parameters, 'radius', 0.1, 1.0, 0.01);
    gui.add(this.parameters, 'tube', 0.01, 1.0, 0.01);
    gui.add(this.parameters, 'tubularSegments', 10, 150, 1);
    gui.add(this.parameters, 'radialSegments', 2, 20, 1);
    gui.add(this.parameters, 'p', 1, 20, 1);
    gui.add(this.parameters, 'q', 0, 20, 1);
    this.gui = gui;
  }

  tick(torus: Mesh) {
    torus.rotation.y += 0.005;
  }
}
