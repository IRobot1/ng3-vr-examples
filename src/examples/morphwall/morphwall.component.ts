import { NgtTriple } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { WebVRService } from "ng3-webxr";
import { Subscription } from "rxjs";
import { Color, Group, InstancedMesh, Intersection, MathUtils, Object3D } from "three";

import { CameraService } from "../../app/camera.service";


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
  position = [0, 0, 0] as NgtTriple;
  rotation = [0, 0, 0] as NgtTriple;
  group!: Group;

  private subs = new Subscription();

  constructor(
    private cameraService: CameraService,
    private webvr: WebVRService,
  ) {
    this.cameraService.position = [0, 0, 6];

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.add(this.webvr.xrsession.subscribe(isPresenting => {
      if (isPresenting) {
        this.position = [0, 0, -4]; // move it back so we're not standing in the middle of wall
      }
      else {
        this.position = [0, 0, 0]; // return to origin
      }
    }));

    let index = 0;

    //setInterval(() => {
    //  if (++index >= this.images.length) index = 0;
    //  this.url = this.images[index];
    //}, 3 * 1000)
  }

  private pitch = 0;

  tick() {
    this.pitch += 0.1;
    this.group.rotation.y = MathUtils.degToRad(this.pitch);
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

  highlight(intersect: Intersection) {
    this.invertcolor(intersect);
  }

  unhighlight(intersect: Intersection) {
    this.invertcolor(intersect);
  }
}
