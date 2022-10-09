import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Intersection, MathUtils, Mesh, MeshBasicMaterial, Shape, ShapeGeometry, Side, Vector3 } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { ButtonColor, HoverColor, roundedRect, SlideColor } from "../flat-ui-utils";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-slider',
  exportAs: 'flatUIInputSlider',
  templateUrl: './input-slider.component.html',
})
export class FlatUIInputSlider extends NgtObjectProps<Mesh>{
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
    if (this._value != newvalue) {
      this.change.next(this._value);
    }
  }

  @Input() min = 0;
  @Input() max = 10;

  private _step = 1;
  @Input()
  get step(): number { return this._step }
  set step(newvalue: number) {
    this._step = newvalue;

    let cur = newvalue;
    this.precision = 1
    while (Math.floor(cur) !== cur) {
      cur *= 10
      this.precision++
    }
  }
  private precision = 1;

  @Input() width = 1;

  @Input() enabled = true;
  @Input() buttoncolor = ButtonColor;
  @Input() slidercolor = SlideColor;


  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<number>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  get x(): number { return MathUtils.mapLinear(this.value, this.min, this.max, -this.width / 2, this.width / 2); }

  side: Side = DoubleSide;
  innerscale = 0.7;
  radius = 0.04;

  override preInit() {
    super.preInit();

    const height = 0.1;

    if (!this.geometry) {
      const flat = new Shape();
      roundedRect(flat, 0, 0, this.width, height, height / 2);

      this.geometry = new ShapeGeometry(flat);
      this.geometry.center();
    }
    if (!this.material) {
      this.material = new MeshBasicMaterial({ color: ButtonColor, side: this.side, opacity: 0.5, transparent: true });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
    this.selectable?.remove(this.slidermesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclicked(mesh, e.data); e.stop = true; });
    mesh.addEventListener('pointerdown', (e: any) => { this.dragging = true; e.stop = true; });
    mesh.addEventListener('pointerup', (e: any) => { this.dragging = false; e.stop = true; });

    mesh.addEventListener('pointermove', (e: any) => { this.over(mesh, e.data); e.stop = true; });
    mesh.addEventListener('pointerout', () => { this.out() });
    mesh.addEventListener('raymissed', () => { this.dragging = false; });

    this.mesh = mesh;
  }

  private slidermesh!: Mesh;

  sliderready(mesh: Mesh) {
    this.selectable?.add(mesh);

    this.slidermesh = mesh;
  }

  dragging = false;

  clicked(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doclicked(mesh, event);
  }

  private doclicked(mesh: Mesh, event: Intersection) {
    if (!this.enabled || !this.visible) return;

    const world = new Vector3();
    mesh.getWorldPosition(world);

    const scale = new Vector3();
    mesh.getWorldScale(scale);

    const buttonmin = ((world.x - this.width / 2 * scale.x) * this.innerscale + this.radius) * scale.x;
    const buttonmax = ((world.x + this.width / 2 * scale.x) * this.innerscale - this.radius) * scale.x;
    const buttonx = MathUtils.clamp(event.point.x * this.innerscale * scale.x, buttonmin, buttonmax);

    const value = MathUtils.mapLinear(buttonx, buttonmin, buttonmax, this.min, this.max);

    // avoid problems when step is fractional
    this.value = +((Math.round(value / this.step) * this.step).toPrecision(this.precision));

    this.change.next(this.value);
  }

  over(mesh: Mesh, event: Intersection) {
    if (!this.enabled) return;

    if (this.dragging) {
      this.doclicked(mesh, event);
    }
    this.material.color.setStyle(HoverColor);
  }

  out() {
    this.material.color.setStyle(this.buttoncolor);
  }
}
