import { Component, OnInit } from "@angular/core";
import { Mesh } from "three";
import { CameraService } from "../../app/camera.service";
import { InteractiveObjects } from "../flat-ui/interactive-objects";
import { FlatGUI } from "./flat-gui";


@Component({
  templateUrl: './three-gui.component.html',
})
export class ThreeGUIExample implements OnInit {
  public parameters = {
    radius: 0.6,
    tube: 0.2,
    tubularSegments: 150,
    radialSegments: 20,
    p: 2,
    q: 3
  };

  public gui!: FlatGUI;
  public meshes: Array<Mesh> = [];

  selectable = new InteractiveObjects();

  constructor(
    public camera: CameraService,
  ) {
    this.camera.position = [0, 1, 0];
    this.camera.lookAt = [-1.3, 1, -3];
    this.camera.fov = 55;


  }

  ngOnInit(): void {
    const gui = new FlatGUI({ width: 300 });
    gui.add(this.parameters, 'radius', 0.1, 1.0, 0.01);
    gui.add(this.parameters, 'tube', 0.01, 1.0, 0.01);
    gui.add(this.parameters, 'tubularSegments', 10, 150, 1);
    gui.add(this.parameters, 'radialSegments', 2, 20, 1);
    gui.add(this.parameters, 'p', 1, 10, 1);
    gui.add(this.parameters, 'q', 0, 10, 1);
    this.gui = gui;
   
  }

  tick(torus: Mesh) {
    torus.rotation.y += 0.005;
  }
}
