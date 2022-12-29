import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from "@angular/core";

import { BufferGeometry, Line, Mesh, Shape, ShapeGeometry, Vector2 } from "three";

import { NgtObjectProps } from "@angular-three/core";
import { GlobalShapeTheme } from "../../shape-theme";

@Component({
  selector: 'expression-shape',
  exportAs: 'expressionShape',
  templateUrl: './expression.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  //  standalone: true,
  //  imports: [
  //    NgtMesh,
  //  ]
})
export class ExpressionShapeComponent extends NgtObjectProps<Mesh>{

  private _width = 0.2;
  @Input()
  get width(): number { return this._width }
  set width(newvalue: number) {
    if (!newvalue) return;
    if (newvalue < 0.2) newvalue = 0.2;

    this._width = newvalue;
    this.updateFlag = true;
  }

  @Input() material = GlobalShapeTheme.ExpressionMaterial;

  @ContentChild('expression') expression?: TemplateRef<unknown>;

  protected geometry!: BufferGeometry;

  protected outlinematerial = GlobalShapeTheme.OutlineMaterial;
  protected outline!: BufferGeometry;

  private updateFlag = true;

  private makeGeometry() {
    const points: Array<Vector2> = []
    points.push(new Vector2(0, 0))
    points.push(new Vector2(this.width, 0))
    points.push(new Vector2(this.width + 0.008, -0.008))
    points.push(new Vector2(this.width + 0.015, -0.016))
    points.push(new Vector2(this.width + 0.021, -0.024))
    points.push(new Vector2(this.width + 0.027, -0.032))
    points.push(new Vector2(this.width + 0.032, -0.04))
    points.push(new Vector2(this.width + 0.036, -0.048))
    points.push(new Vector2(this.width + 0.04, -0.056))
    points.push(new Vector2(this.width + 0.044, -0.064))
    points.push(new Vector2(this.width + 0.046, -0.072))
    points.push(new Vector2(this.width + 0.048, -0.08))
    points.push(new Vector2(this.width + 0.049, -0.088))
    points.push(new Vector2(this.width + 0.05, -0.096))
    points.push(new Vector2(this.width + 0.05, -0.104))
    points.push(new Vector2(this.width + 0.049, -0.112))
    points.push(new Vector2(this.width + 0.048, -0.12))
    points.push(new Vector2(this.width + 0.046, -0.128))
    points.push(new Vector2(this.width + 0.044, -0.136))
    points.push(new Vector2(this.width + 0.04, -0.144))
    points.push(new Vector2(this.width + 0.036, -0.152))
    points.push(new Vector2(this.width + 0.032, -0.16))
    points.push(new Vector2(this.width + 0.027, -0.168))
    points.push(new Vector2(this.width + 0.021, -0.176))
    points.push(new Vector2(this.width + 0.015, -0.184))
    points.push(new Vector2(this.width + 0.008, -0.192))
    points.push(new Vector2(this.width + 0.0, -0.2))
    points.push(new Vector2(0, -0.2))
    points.push(new Vector2(-0.008, -0.192))
    points.push(new Vector2(-0.015, -0.184))
    points.push(new Vector2(-0.021, -0.176))
    points.push(new Vector2(-0.027, -0.168))
    points.push(new Vector2(-0.032, -0.16))
    points.push(new Vector2(-0.036, -0.152))
    points.push(new Vector2(-0.04, -0.144))
    points.push(new Vector2(-0.044, -0.136))
    points.push(new Vector2(-0.046, -0.128))
    points.push(new Vector2(-0.048, -0.12))
    points.push(new Vector2(-0.049, -0.112))
    points.push(new Vector2(-0.05, -0.104))
    points.push(new Vector2(-0.05, -0.096))
    points.push(new Vector2(-0.049, -0.088))
    points.push(new Vector2(-0.048, -0.08))
    points.push(new Vector2(-0.046, -0.072))
    points.push(new Vector2(-0.044, -0.064))
    points.push(new Vector2(-0.04, -0.056))
    points.push(new Vector2(-0.036, -0.048))
    points.push(new Vector2(-0.032, -0.04))
    points.push(new Vector2(-0.027, -0.032))
    points.push(new Vector2(-0.021, -0.024))
    points.push(new Vector2(-0.015, -0.016))
    points.push(new Vector2(-0.008, -0.008))
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
