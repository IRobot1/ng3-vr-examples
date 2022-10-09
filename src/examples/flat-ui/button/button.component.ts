import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Mesh, MeshBasicMaterial, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { ButtonColor, ButtonLabelColor, ClickColor, HoverColor, roundedRect } from "../flat-ui-utils";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-button',
  exportAs: 'flatUIButton',
  templateUrl: './button.component.html',
})
export class FlatUIButton extends NgtObjectProps<Mesh>{
  @Input() text = '';
  @Input() width = 0.5;
  @Input() height = 0.1;

  @Input() enabled = true;
  @Input() active = false;

  @Input() buttoncolor = ButtonColor;
  @Input() hovercolor = HoverColor;
  @Input() clickcolor = ClickColor;
  @Input() labelcolor = ButtonLabelColor;

  @Input() opacity = 0.5;
  @Input() transparent = true;

  @Input() selectable?: InteractiveObjects;

  @Output() pressed = new EventEmitter<string>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  private mesh!: Mesh;

  override preInit() {
    super.preInit();

    if (!this.geometry) {
      const flat = new Shape();
      roundedRect(flat, 0, 0, this.width, this.height, 0.02);

      this.geometry = new ShapeGeometry(flat);
      this.geometry.center();
    }
    if (!this.material) {
      this.material = new MeshBasicMaterial({ color: this.buttoncolor, side: DoubleSide, opacity: this.opacity, transparent: this.transparent });
    }

    if (this.active)
      this.over();
    else
      this.out();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.selectable?.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
  }

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclick(); e.stop = true; })
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.mesh = mesh;
  }

  clicked(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doclick();
  }

  clicking = false;
  private doclick() {
    if (!this.enabled || !this.visible) return;

    this.material.color.setStyle(this.clickcolor);
    this.clicking = true;

    const timer = setTimeout(() => {
      if (this.isover)
        this.material.color.setStyle(this.hovercolor);
      else
        this.material.color.setStyle(this.buttoncolor);

      this.pressed.emit(this.text);

      clearTimeout(timer);
      this.clicking = false;
    }, 100);
  }

  isover = false;
  over() {
    if (this.clicking || this.isover || !this.enabled) return;
    this.material.color.setStyle(this.hovercolor);
    this.isover = true;
  }
  out() {
    this.material.color.setStyle(this.buttoncolor);
    this.isover = false;
  }
}
