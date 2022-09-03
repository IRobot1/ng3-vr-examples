import { NgtTriple } from "@angular-three/core";
import { Component, Input } from "@angular/core";

import { ExtrudeGeometry, Path, Shape } from "three";

class ScaleData {
  constructor(public geometry: ExtrudeGeometry, public color: string, public offset: number) { }
}

@Component({
  selector: 'square-scale',
  templateUrl: './square-scale.component.html',
})
export class SquareScaleComponent {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  scales: Array<ScaleData> = [];

  constructor() {
    const scale = 0.015;
    for (let i = 1; i < 20; i++) {
      const inner = i * scale - scale;
      const outer = inner + scale;

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
      const geometry = new ExtrudeGeometry(shape, { depth: scale, bevelEnabled: false });

      this.scales.push(new ScaleData(geometry, i % 2 == 0 ? 'white' : 'black', inner));
    }
  }
}
