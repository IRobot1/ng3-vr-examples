import { NgtLoader } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { BufferGeometry, CircleBufferGeometry, Curve, DoubleSide, Path, Shape, ShapeGeometry, ShapeUtils, Side, Texture, TextureLoader, Vector2, Vector3 } from "three";

class DotData {
  constructor(public position: Vector3, public color: string) { }
}


@Component({
  templateUrl: './shapes.component.html',
})
export class ShapesExample implements OnInit {
  dots: Array<DotData> = [];

  geometry!: BufferGeometry;
  border!: BufferGeometry;
  texture!: Texture;

  width = 1;
  height = 1;

  side: Side = DoubleSide;

  constructor(private loader: NgtLoader) { }

  ngOnInit(): void {

    let shape = new Shape()
    //this.roundedRect(shape, this.width, this.height, 0.1);
    this.label1(shape, 0.6, 0.8, 0.05);

    const points = shape.getPoints();
    points.forEach(item => item.multiplyScalar(0.98))

    // draw the hole
    const holePath = new Shape(points.reverse())

    
    // add hole to shape
    shape.holes.push(holePath);
    this.border = new ShapeGeometry(shape);

    const points2 = shape.getPoints();
    points2.forEach(item => item.multiplyScalar(0.97))

    this.geometry = new ShapeGeometry(new Shape(points2));


    const s = this.loader.use(TextureLoader, 'assets/label1.png').subscribe(next => {
      this.texture = next; 
    },
      () => { },
      () => { s.unsubscribe(); }
    );

  }

  label1(ctx: Shape, width: number, height: number, radius: number) {
    this.moveTo(ctx, 0, height);
    this.lineTo(ctx, width, height)
    this.quadraticCurveTo(ctx, width+radius, height, width + radius, height-radius);
    this.lineTo(ctx, width+radius, height-0.25)
    this.quadraticCurveTo(ctx, width + 0.7, 0, width + radius, -height + 0.25);
    this.lineTo(ctx, width + radius, -height + radius)
    this.quadraticCurveTo(ctx, width + radius, -height , width , -height);
    this.lineTo(ctx, 0, -height)

    this.lineTo(ctx, -width, -height)
    this.quadraticCurveTo(ctx, -width - radius, -height , -width - radius , -height + radius);
    this.lineTo(ctx, -width - radius, -height + 0.25)
    this.quadraticCurveTo(ctx, -width - 0.7, 0, -width - radius, height - 0.25);
    this.lineTo(ctx, -width-radius, height-radius)
    this.quadraticCurveTo(ctx, -width - radius, height, -width, height);
  }

  roundedRect(ctx: Shape, width: number, height: number, radius: number) {
    this.moveTo(ctx, -width/2,  - height/2 + radius);
    this.lineTo(ctx, -width/2 ,  height/2  - radius);
    this.quadraticCurveTo(ctx, -width/2, height/2, -width/2+radius, height/2);
    this.lineTo(ctx, width/2 - radius,  height/2);
    this.quadraticCurveTo(ctx,  width/2, height/2, width/2, height/2- radius);
    this.lineTo(ctx, width/2, -height/2 + radius);
    this.quadraticCurveTo(ctx, width / 2, -height / 2 , width / 2 - radius, -height / 2);
    this.lineTo(ctx, -width/2 + radius, -height/2);
    this.quadraticCurveTo(ctx, -width / 2, -height / 2, -width / 2, -height / 2 + radius);
  }


  moveTo(ctx: Shape, x: number, y: number): ShapesExample {
    this.dots.push({ position: new Vector3(x, y), color: 'black' })
    ctx.moveTo(x, y)
    return this;
  }
  lineTo(ctx: Shape, x: number, y: number): ShapesExample {
    this.dots.push({ position: new Vector3(x, y), color: 'white' })
    ctx.lineTo(x, y)
    return this;
  }
  quadraticCurveTo(ctx: Shape, aCPx: number, aCPy: number, aX: number, aY: number): ShapesExample {
    this.dots.push({ position: new Vector3(aCPx, aCPy), color: 'blue' })
    this.dots.push({ position: new Vector3(aX, aY), color: 'blue' })
    ctx.quadraticCurveTo(aCPx, aCPy, aX, aY)
    return this;
  }
  bezierCurveTo(ctx: Shape, aCP1x: number, aCP1y: number, aCP2x: number, aCP2y: number, aX: number, aY: number): ShapesExample {
    this.dots.push({ position: new Vector3(aCP1x, aCP1y), color: 'red' })
    this.dots.push({ position: new Vector3(aCP2x, aCP2y), color: 'red' })
    this.dots.push({ position: new Vector3(aX, aY), color: 'red' })
    ctx.bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY)
    return this;
  }
  splineThru(ctx: Shape, pts: Vector2[]): ShapesExample {
    return this;
  }
  arc(ctx: Shape, aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean): ShapesExample {
    this.dots.push({ position: new Vector3(aX, aY), color: 'green' })
    ctx.arc(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise)
    return this;
  }
  absarc(ctx: Shape, aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean): ShapesExample {
    this.dots.push({ position: new Vector3(aX, aY), color: 'lightgreen' })
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
  ): ShapesExample {
    this.dots.push({ position: new Vector3(aX, aY), color: 'orange' })
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
  ): ShapesExample {
    this.dots.push({ position: new Vector3(aX, aY), color: 'gold' })
    ctx.absellipse(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation)
    return this;
  }

}
