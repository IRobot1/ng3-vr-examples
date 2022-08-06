import { NgtTriple } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { Group, MathUtils } from "three";
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

  url = this.images[0];
  rotation = [0, 0, 0] as NgtTriple;
  group!: Group;
  
  constructor(
    private cameraService: CameraService,
  ) {
    this.cameraService.position = [0, 0, 4];
    
  }

  ngOnInit(): void {
    let index = 0;

    setInterval(() => {
      if (++index >= this.images.length) index = 0;
      this.url = this.images[index];
    }, 3 * 1000)
  }

  private pitch = 0;

  tick() {
    this.pitch += 0.1;
    this.group.rotation.y = MathUtils.degToRad(this.pitch);
  }
}
