import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BufferGeometry, Material, MathUtils, Mesh, Shape, ShapeGeometry } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

@Component({
  selector: 'flat-ui-progress-bar',
  exportAs: 'flatUIProgressBar',
  templateUrl: './progress-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIProgressBar extends NgtObjectProps<Mesh> implements AfterViewInit {
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

  private _width = 1;
  @Input()
  get width() { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: WIDTH_CHANGED_EVENT });
    }
  }

  private _height = 0.1;
  @Input()
  get height() { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }


  @Input() progressheight = 0.08;

  private _backgroundmaterial!: Material
  @Input()
  get backgroundmaterial(): Material {
    if (this._backgroundmaterial) return this._backgroundmaterial;
    return GlobalFlatUITheme.ButtonMaterial;
  }
  set backgroundmaterial(newvalue: Material) {
    this._backgroundmaterial = newvalue;
  }

  private _progressmaterial!: Material
  @Input()
  get progressmaterial(): Material {
    if (this._progressmaterial) return this._progressmaterial;
    return GlobalFlatUITheme.ProgressMaterial;
  }
  set progressmaterial(newvalue: Material) {
    this._progressmaterial = newvalue;
  }

  @Input() geometry!: BufferGeometry;

  protected progress!: BufferGeometry;
  protected showprogress = true;

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createProgressGeometry();
  }

  createProgressGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, 0.025);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.geometry?.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });
  }

  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.mesh = mesh;
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
