import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { ButtonColor, HoverColor, roundedRect, StringColor, UIInput } from "../flat-ui-utils";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-text',
  exportAs: 'flatUIInputText',
  templateUrl: './input-text.component.html',
})
export class FlatUIInputText extends NgtObjectProps<Mesh> implements UIInput{
  @Input() text = '';
  @Input() overflow = 6; 

  @Input() enabled = true;
  @Input() width = 0.5;
  @Input() textcolor = StringColor;

  @Input() selectable?: InteractiveObjects;

  @Input() buttoncolor = ButtonColor;
  @Input() hovercolor = HoverColor;

  inputopen = false;
  @Output() openinput = new EventEmitter<Object3D>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  height = 0.1

  get displaytext() {
    let text = this.text.substring(this.text.length - this.overflow);
    if (this.inputopen && this.enabled) text += '_'
    return text;
  }

  override preInit() {
    super.preInit();

    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();

    this.material = new MeshBasicMaterial({ color: this.buttoncolor, side: DoubleSide, opacity: 0.5, transparent: true });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', () => { this.enableinput(mesh) })
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
