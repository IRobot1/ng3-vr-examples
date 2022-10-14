import { BufferGeometry, Shape, ShapeGeometry, Vector2, Vector3 } from "three";

//
// https://threejs.org/docs/#api/en/extras/core/Path
//


class DotData {
  constructor(public position: Vector3, public color: string) { }
}


export abstract class DrawShape {
  dots: Array<DotData> = [];

  private shape = new Shape()

  constructor(public width = 1, public height = 1, public parameters?: any, public track = true) {
    this.drawshape(this.shape, width, height, parameters);
  }

  get geometry() { return this.buildshape(this.shape) }

  buildshape(shape?: Shape): BufferGeometry {
    return new ShapeGeometry(shape)
  }

  abstract drawshape(ctx: Shape, width: number, height: number, parameters?: any): void;

  drawborder(borderwidth = 0.01, borderoffset = 0): BufferGeometry {

    // outer edge
    let points = this.shape.getPoints();
    
    points.forEach(item => {
      if (item.x < 0)
        item.x -= borderoffset + borderwidth
      else
        item.x += borderoffset + borderwidth

      if (item.y < 0)
        item.y -= borderoffset + borderwidth
      else
        item.y += borderoffset + borderwidth
    })

    const shape = new Shape(points);

    // inner edge
    points = this.shape.getPoints();
    points.forEach(item => {
      if (item.x < 0)
        item.x -= borderoffset
      else
        item.x += borderoffset

      if (item.y < 0)
        item.y -= borderoffset
      else
        item.y += borderoffset
    })

    shape.holes.push(new Shape(points.reverse()));

    return this.buildshape(shape);
  }

  moveTo(ctx: Shape, x: number, y: number): DrawShape {
    if (this.track) this.dots.push({ position: new Vector3(x, y), color: 'black' })
    ctx.moveTo(x, y)
    return this;
  }
  lineTo(ctx: Shape, x: number, y: number): DrawShape {
    if (this.track) this.dots.push({ position: new Vector3(x, y), color: 'white' })
    ctx.lineTo(x, y)
    return this;
  }
  quadraticCurveTo(ctx: Shape, aCPx: number, aCPy: number, aX: number, aY: number): DrawShape {
    if (this.track) {
      this.dots.push({ position: new Vector3(aCPx, aCPy), color: 'blue' })
      this.dots.push({ position: new Vector3(aX, aY), color: 'blue' })
    }
    ctx.quadraticCurveTo(aCPx, aCPy, aX, aY)
    return this;
  }
  bezierCurveTo(ctx: Shape, aCP1x: number, aCP1y: number, aCP2x: number, aCP2y: number, aX: number, aY: number): DrawShape {
    if (this.track) {
      this.dots.push({ position: new Vector3(aCP1x, aCP1y), color: 'red' })
      this.dots.push({ position: new Vector3(aCP2x, aCP2y), color: 'darkred' })
      this.dots.push({ position: new Vector3(aX, aY), color: 'pink' })
    }
    ctx.bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY)
    return this;
  }
  splineThru(ctx: Shape, pts: Vector2[]): DrawShape {
    throw new Error("Method not implemented.");
    return this;
  }
  arc(ctx: Shape, aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean): DrawShape {
    if (this.track) this.dots.push({ position: new Vector3(aX, aY), color: 'green' })
    ctx.arc(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise)
    return this;
  }
  absarc(ctx: Shape, aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean): DrawShape {
    if (this.track) this.dots.push({ position: new Vector3(aX, aY), color: 'lightgreen' })
    ctx.absarc(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise)
    return this;
  }
  ellipse(ctx: Shape,
    aX: number,
    aY: number,
    xRadius: number,
    yRadius: number,
    aStartAngle: number,
    aEndAngle: number,
    aClockwise: boolean,
    aRotation: number,
  ): DrawShape {
    if (this.track) this.dots.push({ position: new Vector3(aX, aY), color: 'orange' })
    ctx.ellipse(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation)
    return this;
  }
  absellipse(ctx: Shape,
    aX: number,
    aY: number,
    xRadius: number,
    yRadius: number,
    aStartAngle: number,
    aEndAngle: number,
    aClockwise: boolean,
    aRotation: number,
  ): DrawShape {
    if (this.track) this.dots.push({ position: new Vector3(aX, aY), color: 'gold' })
    ctx.absellipse(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation)
    return this;
  }
}
