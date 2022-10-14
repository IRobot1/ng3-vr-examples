import { Shape } from "three";

import { DrawShape } from "./draw-shape";

export class CloseButtonGeometry extends DrawShape {

  constructor(track = true) {
    super(0.15, 0.1, {}, track)
  }

  drawshape(ctx: Shape, width: number, height: number, parameters: any): void {
    this.moveTo(ctx, 0, height / 2);

    // top left
    this.lineTo(ctx, width / 2 - 0.075, height / 2)
    this.lineTo(ctx, width / 2 - 0.025, height / 2 - 0.05)

    // bottom left
    this.lineTo(ctx, width / 2 - 0.025, -height / 2)

    // bottom right
    this.lineTo(ctx, -width / 2, -height / 2)

    // top left
    this.lineTo(ctx, -width / 2 - 0.05, height / 2)
  }
}
