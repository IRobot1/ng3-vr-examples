import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BufferGeometry, ExtrudeGeometry, Material, MathUtils, Mesh, Shape } from "three";
import { NgtObjectProps } from "@angular-three/core";

@Component({
  selector: 'tablet',
  exportAs: 'tablet',
  templateUrl: './tablet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tablet extends NgtObjectProps<Mesh> {
  private _width = 1;
  @Input()
  get width(): number { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    this.updateFlag = true;
  }

  private _height = 4 / 3;
  @Input()
  get height(): number { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    this.updateFlag = true;
  }

  private corner = 0.1;
  private depth = 0.06;
  private bevelsize = 0.02;

  @Input() material!: Material;

  protected geometry!: BufferGeometry;

  private refresh() {
    const shape = new Shape()
      .moveTo(0, -this.height / 2 - this.corner)
      .lineTo(-this.width / 2, -this.height / 2 - this.corner)
      .quadraticCurveTo(-this.width / 2 - this.corner, -this.height / 2 - this.corner, -this.width / 2 - this.corner, -this.height / 2)
      .lineTo(-this.width / 2 - this.corner, this.height / 2)
      .quadraticCurveTo(-this.width / 2 - this.corner, this.height / 2 + this.corner, -this.width / 2, this.height / 2 + this.corner)
      .lineTo(this.width / 2, this.height / 2 + this.corner)
      .quadraticCurveTo(this.width / 2 + this.corner, this.height / 2 + this.corner, this.width / 2 + this.corner, this.height / 2)
      .lineTo(this.width / 2 + this.corner, -this.height / 2)
      .quadraticCurveTo(this.width / 2 + this.corner, -this.height / 2 - this.corner, this.width / 2, -this.height / 2 - this.corner)


    this.geometry = new ExtrudeGeometry(shape, { bevelEnabled: true, depth: this.depth, bevelThickness: this.bevelsize, bevelSize: this.bevelsize });
    this.geometry.translate(0, this.height / 2 + this.corner + this.bevelsize, -this.depth / 2)
  }

  private updateFlag = true;

  tick() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.refresh();
    }
  }
}
