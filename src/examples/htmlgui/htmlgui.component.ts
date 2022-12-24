import { Component, OnInit } from "@angular/core";

import { Mesh } from "three";

import { InteractiveObjects } from "ng3-flat-ui";

import { Ng3GUI } from "ng3-gui";

import { CameraService } from "../../app/camera.service";


@Component({
  templateUrl: './htmlgui.component.html',
})
export class HTMLGUIExample implements OnInit {
  public parameters = {
    radius: 0.5,
    tube: 0.05,
    tubularSegments: 150,
    radialSegments: 20,
    p: 3,
    q: 1,
    speed: 0.005,
    rotate: 90,
  };

  public gui!: Ng3GUI;
  selectable = new InteractiveObjects();

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
    gui.add(this.parameters, 'tube', 0.01, 0.1, 0.01);
    gui.add(this.parameters, 'tubularSegments', 10, 1000, 1);
    gui.add(this.parameters, 'radialSegments', 2, 20, 1);
    gui.add(this.parameters, 'p', 1, 20, 1);
    gui.add(this.parameters, 'q', 0, 20, 1);
    gui.add(this.parameters, 'speed', 0.01, 0.05, 0.01);
    gui.add(this.parameters, 'rotate', 0, 90, 1);
    this.gui = gui;
  }

  tick(torus: Mesh) {
    torus.rotation.z += this.parameters.speed;
  }
}
