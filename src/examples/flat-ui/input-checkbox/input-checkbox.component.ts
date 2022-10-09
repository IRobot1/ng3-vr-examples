import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Material, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry, Side } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { ButtonColor, CheckColor, HoverColor, roundedRect } from "../flat-ui-utils";
import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-checkbox',
  exportAs: 'flatUIInputCheckbox',
  templateUrl: './input-checkbox.component.html',
})
export class FlatUIInputCheckbox extends NgtObjectProps<Mesh>{
  private _checked = false;
  @Input()
  get checked(): boolean { return this._checked }
  set checked(newvalue: boolean) {
    this._checked = newvalue;

    if (this.checkmesh)
      this.checkmesh.visible = this.checked;
  }

  @Input() buttoncolor = ButtonColor;
  @Input() hovercolor = HoverColor;

  @Input() enabled = true;
  @Input() truecolor = CheckColor;

  @Input() geometry!: BufferGeometry;
  @Input() material!: MeshBasicMaterial;

  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<boolean>();

  width = 0.1;  // use scale to resize?

  side: Side = DoubleSide;

  private checkmesh!: Mesh;

  override preInit() {
    super.preInit();

    if (!this.geometry) {
      const flat = new Shape();
      roundedRect(flat, 0, 0, this.width, this.width, 0.02);

      this.geometry = new ShapeGeometry(flat);
      this.geometry.center();
    }
    if (!this.material) {
      this.material = new MeshBasicMaterial({ color: this.buttoncolor, side: this.side, opacity: 0.5, transparent: true });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
    this.selectable?.remove(this.checkmesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.mesh = mesh;
  }

  checkready(mesh: Mesh) {
    this.selectable?.add(mesh)

    mesh.visible = this.checked;

    mesh.addEventListener('click', () => { this.doclick() })
    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.checkmesh = mesh;
  }

  clicked(event: NgtEvent<MouseEvent>) {
    if (event.object != this.checkmesh) return;
    event.stopPropagation();

    this.doclick();
  }

  private doclick() {
    if (!this.enabled || !this.visible) return;
    this.checked = !this.checked;
    this.change.next(this.checked);
  }

  isover = false;
  over() {
    if (this.isover || !this.enabled) return;
    this.material.color.setStyle(this.hovercolor);
    this.isover = true;
  }
  out() {
    this.material.color.setStyle(this.buttoncolor);
    this.isover = false;
  }

}
