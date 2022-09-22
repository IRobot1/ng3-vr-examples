import { Component, Input, OnInit } from "@angular/core";

import { BufferGeometry, DoubleSide, Group, LineBasicMaterial, MathUtils, Shape, ShapeGeometry, Side } from "three";
import { NgtTriple } from "@angular-three/core";


class SquareData {
  constructor(public position: number, public rotation: number, public color: string, public scale: number) { }
}

@Component({
  selector: 'rotating-squares',
  templateUrl: './rotating-squares.component.html',
})
export class RotatingSquaresComponent implements OnInit {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;
  @Input() color1 = 'purple';
  @Input() color2 = 'white';
  @Input() count = 60;

  squares: Array<SquareData> = [];

  fill!: BufferGeometry;
  outline!: BufferGeometry;

  material = new LineBasicMaterial({ color: 0x000000 });
  group!: Group;

  side: Side = DoubleSide;

  ngOnInit(): void {
    const outer = 0.1;

    const shape = new Shape()
      .moveTo(-outer, outer)
      .lineTo(outer, outer)
      .lineTo(outer, -outer)
      .lineTo(-outer, -outer)
      .lineTo(-outer, outer)

    this.fill = new ShapeGeometry(shape);

    this.outline = new ShapeGeometry(shape);

    let position = 0;
    let color = this.color1;
    let rotation = 0;
    let scale = 0.1;
    const degres45 = MathUtils.degToRad(45);

    for (let i = 0; i < this.count; i++) {
      if (i % 2 == 0) {
        color = this.color1;
        rotation = degres45;
      }
      else {
        color = this.color2;
        rotation = 0;
      }
      this.squares.push(new SquareData(position, rotation, color, scale))
      position -= 0.0005;
      scale += 0.1;
    }

  }

  tick() {
    this.group.children.forEach((mesh, index) => {
      mesh.rotation.z += 0.0001 * index;
    })
  }
}
