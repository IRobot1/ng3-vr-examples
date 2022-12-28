import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BufferGeometry, Material, Mesh, Shape, ShapeGeometry, Vector2 } from "three";

import { NgtObjectProps } from "@angular-three/core";

@Component({
  selector: 'condition-shape',
  exportAs: 'conditionShape',
  templateUrl: './condition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  //  standalone: true,
  //  imports: [
  //    NgtMesh,
  //  ]
})
export class ConditionShapeComponent extends NgtObjectProps<Mesh>{

  private _width = 0.2;
  @Input()
  get width(): number { return this._width }
  set width(newvalue: number) {
    if (!newvalue) return;
    if (newvalue < 0.2) newvalue = 0.2;

    this._width = newvalue;
    this.updateFlag = true;
  }

  @Input() material!: Material;

  protected geometry!: BufferGeometry;
  private updateFlag = true;

  private makeGeometry() {
    const points: Array<Vector2> = []
    points.push(new Vector2(0, 0))
    points.push(new Vector2(this.width, 0))
    points.push(new Vector2(this.width+0.1, -0.1))
    points.push(new Vector2(this.width, -0.2))
    points.push(new Vector2(0, -0.2))
    points.push(new Vector2(-0.1, -0.1))
    points.push(new Vector2(0, 0))
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
