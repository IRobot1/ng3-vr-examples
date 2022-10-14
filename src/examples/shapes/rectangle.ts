import { Shape } from "three";

import { DrawShape } from "./draw-shape";

export class RectangleGeometry extends DrawShape {

  constructor(width = 0.4, height = 0.2, track = true) {
    super(width, height, {}, track)
  }

  drawshape(ctx: Shape, width: number, height: number, parameters?: any): void {
    this.moveTo(ctx, 0, height / 2);

    // top left
    this.lineTo(ctx, width / 2, height / 2)

    // bottom left
    this.lineTo(ctx, width / 2, -height / 2)

    // bottom right
    this.lineTo(ctx, -width / 2, -height / 2)

    // top left
    this.lineTo(ctx, -width / 2, height / 2)
  }
}
