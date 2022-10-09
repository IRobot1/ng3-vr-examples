import { Component, Input } from "@angular/core";

import { BufferGeometry, DoubleSide, MathUtils, Mesh, MeshBasicMaterial, Shape, ShapeGeometry, Side } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { ButtonColor, ProgressColor, roundedRect } from "../flat-ui-utils";

@Component({
  selector: 'flat-ui-progress-bar',
  exportAs: 'flatUIProgressBar',
  templateUrl: './progress-bar.component.html',
})
export class FlatUIProgressBar extends NgtObjectProps<Mesh>{
  private _value = 0;
  @Input()
  get value(): number { return this._value }
  set value(newvalue: number) {
    if (this.min > this.max) {
      console.warn(`min ${this.min} is greater than max ${this.max}`);
      let temp = this.min;
      this.min = this.max;
      this.max = temp;
    }
    this._value = MathUtils.clamp(newvalue, this.min, this.max);

    this.renderprogress();
  }

  @Input() min = 0;
  @Input() max = 10;

  @Input() width = 1;
  @Input() height = 0.1;
  @Input() progressheight = 0.08;

  @Input() buttoncolor = ButtonColor;
  @Input() progresscolor = ProgressColor;

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  side: Side = DoubleSide;

  progress!: BufferGeometry;
  showprogress = true;

  override preInit() {
    super.preInit();

    if (!this.geometry) {
      const flat = new Shape();
      roundedRect(flat, 0, 0, this.width, this.height, 0.025);

      this.geometry = new ShapeGeometry(flat);
      this.geometry.center();
    }
    if (!this.material) {
      this.material = new MeshBasicMaterial({ color: ButtonColor, side: this.side, opacity: 0.5, transparent: true });
    }
  }

  override ngOnDestroy() {
    this.geometry?.dispose();
    this.material?.dispose();
  }

  private renderprogress() {

    const width = MathUtils.mapLinear(this.value, this.min, this.max, 0, this.width - 0.02);

    const shape = new Shape();
    roundedRect(shape, 0, 0, width, this.progressheight, 0.025);

    this.progress?.dispose();
    this.progress = new ShapeGeometry(shape);

    this.showprogress = width != 0;
  }
}
