import { NgtTriple } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { WebVRService } from "ng3-webxr";
import { Subscription } from "rxjs";
import { Color, Group, InstancedMesh, Intersection, MathUtils, Matrix4, Object3D, Quaternion, Vector3 } from "three";

import { CameraService } from "../../app/camera.service";
import { ImageWallComponent } from "./image-wall/image-wall.component";


@Component({
  templateUrl: './morphwall.component.html',
})
export class MorphWallExample implements OnInit {

  public images: Array<string> = [
    'assets/mandelbrot1.jpg',
    'assets/mandelbrot2.jpg',
    'assets/mandelbrot3.jpg',
  ]

  selectable: Array<Object3D> = [];

  url = this.images[2];
  gap = 0; // 0.005;

  position = [0, 0, 0] as NgtTriple;
  rotation = [0, 0, 0] as NgtTriple;
  group!: Group;

  private subs = new Subscription();

  constructor(
    private cameraService: CameraService,
    private webvr: WebVRService,
  ) {
    this.cameraService.position = [0, 0, -2];

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.add(this.webvr.xrsession.subscribe(isPresenting => {
      if (isPresenting) {
        this.position = [0, 1.5, -1]; // move it so we're not standing in the middle of wall
      }
      else {
        this.position = [0, 0, 0]; // return to origin
        this.cameraService.position = [0, 0, -2];
      }
    }));

    // cycle through images
    //let index = 0;
    //setInterval(() => {
    //  if (++index >= this.images.length) index = 0;
    //  this.url = this.images[index];
    //}, 10 * 1000)
  }

  private yaw = 0;

  tick() {
    this.yaw += 0.1;
    this.group.rotation.y = MathUtils.degToRad(this.yaw);
  }

  invertcolor(intersect: Intersection) {
    if (!intersect.instanceId) return;

    const object = intersect.object as InstancedMesh;
    const color = new Color();
    object.getColorAt(intersect.instanceId, color)
    color.r = 255 - color.r;
    color.g = 255 - color.g;
    color.b = 255 - color.b;
    object.setColorAt(intersect.instanceId, color);
    if (object.instanceColor) object.instanceColor.needsUpdate = true;

  }

  private isSelected = false;

  selected(wall: ImageWallComponent) {
    if (!this.isSelected) {

      // explode pixels
      const displace = 0.8;
      wall.data.forEach((item, index) => {
        const matrix = new Matrix4();
        item.position.z = -displace + Math.random() * displace * 2 + 0.01;
        matrix.setPosition(item.position);
        wall.inst.setMatrixAt(index, matrix);
        wall.inst.instanceMatrix.needsUpdate = true;
      });
    }
    else {
      // return pixels to origin
      wall.data.forEach((item, index) => {
        const matrix = new Matrix4();
        item.position.z = 0;
        matrix.setPosition(item.position);
        wall.inst.setMatrixAt(index, matrix);
        wall.inst.instanceMatrix.needsUpdate = true;
      });
    }
    this.isSelected = !this.isSelected;
  }


  highlight(intersect: Intersection, wall: ImageWallComponent) {
    this.invertcolor(intersect);

    // return highlighted pixel to origin
    const index = intersect.instanceId;
    if (index) {
      const matrix = new Matrix4();

      const item = wall.data[index];
      item.position.z = 0;
      matrix.setPosition(item.position);

      wall.inst.setMatrixAt(index, matrix);
      wall.inst.instanceMatrix.needsUpdate = true;

    }
  }

  unhighlight(intersect: Intersection) {
    this.invertcolor(intersect);
  }
}
