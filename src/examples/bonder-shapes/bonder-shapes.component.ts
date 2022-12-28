import { Component, OnInit } from "@angular/core";
import { BufferGeometry, Shape, ShapeGeometry, Vector2 } from "three";

@Component({
  templateUrl: './bonder-shapes.component.html',
})
export class BonderShapesExample implements OnInit {
  geometry!: BufferGeometry;

  ngOnInit(): void {
    const points: Array<Vector2> = [
      new Vector2(0, 0),
      new Vector2(0.2, 0),
      new Vector2(0.2, 0),
      new Vector2(0.3, -0.1),
      new Vector2(0.3, -0.1),
      new Vector2(0.5, -0.1),
      new Vector2(0.5, -0.1),
      new Vector2(0.6, 0),
      new Vector2(0.6, 0),
      new Vector2(0.8, 0),
      new Vector2(0.8, 0),
      new Vector2(0.8, -0.4),
      new Vector2(0.8, -0.4),
      new Vector2(0.6, -0.4),
      new Vector2(0.6, -0.4),
      new Vector2(0.5, -0.5),
      new Vector2(0.5, -0.5),
      new Vector2(0.3, -0.5),
      new Vector2(0.3, -0.5),
      new Vector2(0.2, -0.4),
      new Vector2(0.2, -0.4),
      new Vector2(0.1, -0.4),
      new Vector2(0.1, -0.4),
      new Vector2(0.1, -0.6),
      new Vector2(0.1, -0.6),
      new Vector2(0.2, -0.6),
      new Vector2(0.2, -0.6),
      new Vector2(0.3, -0.7),
      new Vector2(0.3, -0.7),
      new Vector2(0.5, -0.7),
      new Vector2(0.5, -0.7),
      new Vector2(0.6, -0.6),
      new Vector2(0.6, -0.6),
      new Vector2(0.8, -0.6),
      new Vector2(0.8, -0.6),
      new Vector2(0.8, -1),
      new Vector2(0.8, -1),
      new Vector2(0.6, -1),
      new Vector2(0.6, -1),
      new Vector2(0.5, -1.1),
      new Vector2(0.5, -1.1),
      new Vector2(0.3, -1.1),
      new Vector2(0.3, -1.1),
      new Vector2(0.2, -1),
      new Vector2(0.2, -1),
      new Vector2(0, -1),
    ]
    const shape = new Shape(points);
    this.geometry = new ShapeGeometry(shape);
  }

}
