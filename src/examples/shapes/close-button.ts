import { Shape } from "three";

import { DrawShape } from "./draw-shape";

export class CloseButtonGeometry extends DrawShape {

  drawshape(ctx: Shape, width: number, height: number, parameters: any): void {
    const leftoffset = parameters?.leftoffset ?? 0;
    const rightoffset = parameters?.rightoffset ?? 0;
  
    this.moveTo(ctx, 0, height / 2);

    // top left
    this.lineTo(ctx, width / 2 + rightoffset, 0)

    // bottom left
    this.lineTo(ctx, width / 2 + rightoffset, -height / 2)
    this.lineTo(ctx, 0, -height / 2)

    // bottom right
    this.lineTo(ctx, -width / 4 - leftoffset, -height / 2)
    this.lineTo(ctx, -width * 0.75 - leftoffset, 0)

    //  // top left
    this.lineTo(ctx, -width * 1.25 - leftoffset, height / 2)
  }
}
