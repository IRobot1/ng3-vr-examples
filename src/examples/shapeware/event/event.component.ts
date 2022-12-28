import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BufferGeometry, Material, Mesh, Shape, ShapeGeometry, Vector2 } from "three";

import { NgtObjectProps } from "@angular-three/core";
import { NgtMesh } from "@angular-three/core/meshes";

@Component({
  selector: 'event-shape',
  exportAs: 'eventShape',
  templateUrl: './event.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  //  standalone: true,
  //  imports: [
  //    NgtMesh,
  //  ]
})
export class EventShapeComponent extends NgtObjectProps<Mesh>{

  private _width = 1;
  @Input()
  get width(): number { return this._width }
  set width(newvalue: number) {
    if (!newvalue) return;
    if (newvalue < 1) newvalue = 1;

    this._width = newvalue;
    this.updateFlag = true;
  }

  @Input() material!: Material;

  protected geometry!: BufferGeometry;
  private updateFlag = true;

  private makeGeometry() {
    const points: Array<Vector2> = []
    points.push(new Vector2(0, 0))
    points.push(new Vector2(0.032, 0.023))
    points.push(new Vector2(0.064, 0.044))
    points.push(new Vector2(0.096, 0.063))
    points.push(new Vector2(0.128, 0.081))
    points.push(new Vector2(0.16, 0.096))
    points.push(new Vector2(0.192, 0.109))
    points.push(new Vector2(0.224, 0.121))
    points.push(new Vector2(0.256, 0.131))
    points.push(new Vector2(0.288, 0.138))
    points.push(new Vector2(0.32, 0.144))
    points.push(new Vector2(0.352, 0.148))
    points.push(new Vector2(0.384, 0.15))
    points.push(new Vector2(0.416, 0.15))
    points.push(new Vector2(0.448, 0.148))
    points.push(new Vector2(0.48, 0.144))
    points.push(new Vector2(0.512, 0.138))
    points.push(new Vector2(0.544, 0.131))
    points.push(new Vector2(0.576, 0.121))
    points.push(new Vector2(0.608, 0.109))
    points.push(new Vector2(0.64, 0.096))
    points.push(new Vector2(0.672, 0.081))
    points.push(new Vector2(0.704, 0.063))
    points.push(new Vector2(0.736, 0.044))
    points.push(new Vector2(0.768, 0.023))
    points.push(new Vector2(0.8, 0))
    points.push(new Vector2(this.width, 0))
    points.push(new Vector2(this.width, -0.4))
    points.push(new Vector2(0.5, -0.4))
    points.push(new Vector2(0.4, -0.5))
    points.push(new Vector2(0.2, -0.5))
    points.push(new Vector2(0.1, -0.4))
    points.push(new Vector2(0, -0.4))
    const shape = new Shape(points);
    this.geometry = new ShapeGeometry(shape);
  }


  protected draw() {
    if (this.updateFlag) {
      this.makeGeometry();
      this.updateFlag = false;
    }
  }
}
