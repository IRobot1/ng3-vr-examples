import { NgtLoader, NgtTriple } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { BufferGeometry, CircleBufferGeometry, Curve, DoubleSide, Path, Shape, ShapeGeometry, ShapeUtils, Side, Texture, TextureLoader, Vector2, Vector3 } from "three";
import { Button1Geometry } from "./button1";
import { Dialog1Geometry } from "./dialog1";
import { DrawShape } from "./draw-shape";
import { Label1Geometry } from "./label1";
import { Label2Geometry } from "./label2";
import { RoundRectangeGeometry } from "./round-rectangle";


@Component({
  templateUrl: './shapes.component.html',
})
export class ShapesExample implements OnInit {

  shape!:DrawShape;
  border!: BufferGeometry;

  scale = 1.1
  scaleborder = [this.scale, this.scale, this.scale] as NgtTriple;

  side: Side = DoubleSide;

  texture!: Texture;

  constructor(private loader: NgtLoader) { }

  ngOnInit(): void {
    //this.shape = new RoundRectangeGeometry()
    this.shape = new Button1Geometry(0.5, 0.25)
    this.border = this.shape.drawborder(0.07)

    const s = this.loader.use(TextureLoader, 'assets/label.png').subscribe(next => {
      this.texture = next; 
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }
}
