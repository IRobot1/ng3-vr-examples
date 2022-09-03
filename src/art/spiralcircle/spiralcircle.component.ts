import { Component, Input } from "@angular/core";

import { ExtrudeGeometry, MathUtils, Path, Shape } from "three";
import { NgtTriple } from "@angular-three/core";

//
// based on image from article https://www.creativebloq.com/news/optical-illusion-spiral-circles
//

class SpiralData {
  constructor(public position: NgtTriple, public angle: number, public rotation: number, public color: string) { }
}

@Component({
  selector: 'spiral-circle',
  templateUrl: './spiralcircle.component.html',
})
export class SpiralCircleComponent {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  rings: Array<Array<SpiralData>> = [];

  geometry!: ExtrudeGeometry;

  constructor() {
    const outer = 1;
    const inner = 0.7;

    const shape = new Shape()
      .moveTo(-outer, outer)
      .lineTo(outer, outer)
      .lineTo(outer, -outer)
      .lineTo(-outer, -outer)
      .lineTo(-outer, outer)

    const holePath = new Path()
      .moveTo(-inner, inner)
      .lineTo(-inner, -inner)
      .lineTo(inner, -inner)
      .lineTo(inner, inner)
      .lineTo(-inner, inner)

    shape.holes.push(holePath);
    this.geometry = new ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });

    const PI2 = Math.PI * 2

    let sides = 14;
    let offset = MathUtils.degToRad(360 / sides) / 2;

    for (let index = 0; index < 5; index++) {
      const ring: Array<SpiralData> = [];
      offset = -offset;


      let rotation = MathUtils.degToRad(360 / sides);
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * PI2;

        ring.push(new SpiralData([Math.sin(angle), Math.cos(angle), 0], rotation * i, offset, i % 2 == 0 ? 'white' : 'black'));
      }
      this.rings.push(ring);
      sides += 14;
    }

  }
}
