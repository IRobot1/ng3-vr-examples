import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Material, MathUtils, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry, Vector3 } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { ButtonColor, HoverColor, roundedRect, UIInput } from "../flat-ui-utils";
import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-color',
  exportAs: 'flatUIInputColor',
  templateUrl: './input-color.component.html',
})
export class FlatUIInputColor extends NgtObjectProps<Mesh> implements UIInput {
  private _value = ButtonColor;
  @Input()
  get value(): string { return this._value }
  set value(newvalue: string) {
    this._value = newvalue;
    if (this.material) {
      this.updatecolor();
    }
  }

  @Input() text = '';

  @Input() enabled = true;
  @Input() width = 0.4;

  @Input() buttoncolor = ButtonColor;
  @Input() hovercolor = HoverColor;

  @Input() selectable?: InteractiveObjects;

  inputopen = false;
  @Output() openinput = new EventEmitter<Object3D>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  updatecolor() {
    this.material.color.setStyle(this.value);
  }

  override preInit() {
    super.preInit();

    if (!this.geometry) {
      const flat = new Shape();
      roundedRect(flat, 0, 0, this.width, 0.1, 0.02);

      this.geometry = new ShapeGeometry(flat);
      this.geometry.center();
    }
    if (!this.material) {
      this.material = new MeshBasicMaterial({ color: this.buttoncolor, side: DoubleSide, opacity: 0.5, transparent: true });
    }
  }

  override ngOnInit() {
    super.ngOnInit();
    this.updatecolor();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh)

    mesh.addEventListener('click', () => { this.enableinput(mesh) });
    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.mesh = mesh;
  }

  enableinput(mesh: Mesh) {
    if (!this.enabled || !this.visible) return;

    this.inputopen = true;
    this.openinput.next(mesh);
  }

  isover = false;
  over() {
    if (this.isover) return;
    this.material.color.setStyle(this.hovercolor);
    this.isover = true;
  }
  out() {
    this.material.color.setStyle(this.buttoncolor);
    this.isover = false;
  }
}
