import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Intersection, Line, Material, MathUtils, Mesh, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-slider',
  exportAs: 'flatUIInputSlider',
  templateUrl: './input-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIInputSlider extends NgtObjectProps<Mesh> implements AfterViewInit {
  private _value = 0;
  @Input()
  get value(): number { return this._value }
  set value(newvalue: number) {
    if (this.min != undefined && this.max != undefined) {
      if (this.min > this.max) {
        console.warn(`min ${this.min} is greater than max ${this.max}`);
        let temp = this.min;
        this.min = this.max;
        this.max = temp;
      }
      this._value = MathUtils.clamp(newvalue, this.min, this.max);
      this.change.next(this._value);
    }
    else {
      this._value = newvalue
      this.change.next(this._value);
    }
  }

  @Input() min?: number;
  @Input() max?: number;

  private _step?= 1;
  @Input()
  get step(): number | undefined { return this._step }
  set step(newvalue: number | undefined) {
    this._step = newvalue;

    if (newvalue != undefined) {
      let cur = newvalue;
      this.precision = 1
      while (Math.floor(cur) !== cur) {
        cur *= 10
        this.precision++
      }
    }
    else {
      if (this.min != undefined && this.max != undefined) {
        this._step = (this.max - this.min) / 10;
      }
    }
  }
  private precision = 1;

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


  private _enabled = true;
  @Input()
  get enabled(): boolean { return this._enabled }
  set enabled(newvalue: boolean) {
    this._enabled = newvalue;
    if (this.mesh)
      this.setBackgroundColor();
  }

  private _backgroundmaterial!: Material
  @Input()
  get backgroundmaterial(): Material {
    if (this._backgroundmaterial) return this._backgroundmaterial;
    return GlobalFlatUITheme.ButtonMaterial;
  }
  set backgroundmaterial(newvalue: Material) {
    this._backgroundmaterial = newvalue;
  }

  private _outlinematerial!: Material
  @Input()
  get outlinematerial(): Material {
    if (this._outlinematerial) return this._outlinematerial;
    return GlobalFlatUITheme.OutlineMaterial;
  }
  set outlinematerial(newvalue: Material) {
    this._outlinematerial = newvalue;
  }

  private _disabledmaterial!: Material
  @Input()
  get disabledmaterial(): Material {
    if (this._disabledmaterial) return this._disabledmaterial;
    return GlobalFlatUITheme.DisabledMaterial;
  }
  set disabledmaterial(newvalue: Material) {
    this._disabledmaterial = newvalue;
  }

  private _slidermaterial!: Material
  @Input()
  get slidermaterial(): Material {
    if (this._slidermaterial) return this._slidermaterial;
    return GlobalFlatUITheme.SliderMaterial;
  }
  set slidermaterial(newvalue: Material) {
    this._slidermaterial = newvalue;
  }

  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<number>();

  @Input() geometry!: BufferGeometry;

  get x(): number {
    if (this.min != undefined && this.max != undefined) {
      return MathUtils.mapLinear(this.value, this.min, this.max, -this.width / 2, this.width / 2);
    }
    return this.width / 2 ;
  }

  protected innerscale = 0.7;
  protected radius = 0.04;

  protected outline!: BufferGeometry; // outline material

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createSliderGeometry();
  }

  createSliderGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, this.height / 2);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();

    this.outline = new BufferGeometry().setFromPoints(flat.getPoints());
    this.outline.center();
  }

  setBackgroundColor() {
    if (this.enabled) {
      this.mesh.material = this.backgroundmaterial;
    }
    else {
      this.mesh.material = this.disabledmaterial;
    }
  }


  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
    this.selectable?.remove(this.slidermesh);

    this.geometry.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });
  }

  private line!: Line;
  lineready(line: Line) {
    line.visible = false;
    this.line = line;
  }


  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclicked(mesh, e.data); e.stop = true; });
    mesh.addEventListener('pointerdown', (e: any) => { this.dragging = true; e.stop = true; });
    mesh.addEventListener('pointerup', (e: any) => { this.dragging = false; e.stop = true; });

    mesh.addEventListener('pointermove', (e: any) => { this.over(mesh, e.data); e.stop = true; });
    mesh.addEventListener('pointerout', () => { this.out() });
    mesh.addEventListener('raymissed', () => { this.dragging = false; });

    this.mesh = mesh;
    this.setBackgroundColor();
  }

  private slidermesh!: Mesh;

  protected sliderready(mesh: Mesh) {
    this.selectable?.add(mesh);

    this.slidermesh = mesh;
  }

  dragging = false;

  protected clicked(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doclicked(mesh, event);
  }

  private doclicked(mesh: Mesh, event: Intersection) {
    if (!this.enabled || !this.visible) return;

    if (this.min != undefined && this.max != undefined && this.step != undefined) {
      mesh.worldToLocal(event.point);

      const buttonmin = -(this.width / 2) * this.innerscale + this.radius;
      const buttonmax = (this.width / 2) * this.innerscale - this.radius;
      const buttonx = MathUtils.clamp(event.point.x * this.innerscale, buttonmin, buttonmax);

      const value = MathUtils.mapLinear(buttonx, buttonmin, buttonmax, this.min, this.max);

      // avoid problems when step is fractional
      this.value = +((Math.round(value / this.step) * this.step).toFixed(this.precision));

      this.change.next(this.value);
    }
  }

  protected over(mesh: Mesh, event: Intersection) {
    if (!this.enabled) return;

    if (this.dragging) {
      this.doclicked(mesh, event);
    }
    this.line.visible = true;
  }

  protected out() {
    this.line.visible = false;
  }
}
