import { NgtLoader, NgtTriple } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { BufferGeometry, CircleBufferGeometry, Curve, DoubleSide, Path, Shape, ShapeGeometry, ShapeUtils, Side, Texture, TextureLoader, Vector2, Vector3 } from "three";
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
    this.shape = new Label2Geometry()
    this.border = this.shape.drawborder(0.07)

    const s = this.loader.use(TextureLoader, 'assets/label.png').subscribe(next => {
      this.texture = next; 
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }
}
