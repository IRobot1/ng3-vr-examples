import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BufferGeometry, Line, Material, Mesh, Shape, ShapeGeometry, Vector2 } from "three";

import { NgtObjectProps } from "@angular-three/core";
import { GlobalShapeTheme } from "../../shape-theme";

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

  protected material = GlobalShapeTheme.ConditionMaterial;
  protected geometry!: BufferGeometry;

  protected outlinematerial = GlobalShapeTheme.OutlineMaterial;
  protected outline!: BufferGeometry;

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

    if (this.outline) this.outline.dispose();
    this.outline = new BufferGeometry().setFromPoints(points);
  }


  protected draw(mesh: Mesh, line: Line) {
    if (this.updateFlag) {
      this.makeGeometry();
      if (mesh.geometry) mesh.geometry.dispose();
      mesh.geometry = this.geometry;
      if (line.geometry) line.geometry.dispose();
      line.geometry = this.outline;
      this.updateFlag = false;
    }
  }
}
