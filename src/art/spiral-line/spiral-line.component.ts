import { Component, Input } from "@angular/core";

import { ExtrudeGeometry, MathUtils, Object3D, Shape } from "three";
import { NgtTriple } from "@angular-three/core";

class SpiralData {
  constructor(public position: NgtTriple, public angle: number, public scale: number) { }
}

@Component({
  selector: 'spiral-line',
  templateUrl: './spiral-line.component.html',
})
export class SpiralLineComponent {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  @Input() animate = true;

  lines: Array<SpiralData> = [];

  geometry!: ExtrudeGeometry;

  constructor() {
    const shape = new Shape()
      .moveTo(-0.001, 0.5)
      .lineTo(0.001, 0.5)
      .lineTo(0.001, -0.5)
      .lineTo(-0.001, -0.5)
      .lineTo(-0.001, 0.5)

    this.geometry = new ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });

    let x = -0.5;
    let scale = 1;

    const scalefactor = 0.01;
    const xfactor = 0.005;
    for (let i = 0; i < 25; i++) {
      this.lines.push(new SpiralData([x, 0, 0], MathUtils.degToRad(i), scale));
      x += xfactor;
      scale -= scalefactor;
      this.lines.push(new SpiralData([x, 0, 0], MathUtils.degToRad(-90 + i ), scale));
      x += xfactor;
      scale -= scalefactor;
      this.lines.push(new SpiralData([x, 0, 0], MathUtils.degToRad(-180 + i), scale));
      x += xfactor;
      scale -= scalefactor;
      this.lines.push(new SpiralData([x, 0, 0], MathUtils.degToRad(-270 + i), scale));
      x += xfactor;
      scale -= scalefactor;
    }
  }

  tick(group: Object3D) {
    if (this.animate) {
      group.rotation.y += 0.005;
    }
  }
}
