import { Component, EventEmitter, Input, Output } from "@angular/core";

import { DoubleSide, Mesh, MeshBasicMaterial, Side } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { ButtonColor, HoverColor, RadioTrueColor } from "../flat-ui-utils";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-radio-button',
  exportAs: 'flatUIRadioButton',
  templateUrl: './radio-button.component.html',
})
export class FlatUIRadioButton extends NgtObjectProps<Mesh>{
  @Input() checked = false;
  @Input() segments = 32;

  @Input() enabled = true;

  @Input() truecolor = RadioTrueColor;
  @Input() hovercolor = HoverColor;
  @Input() buttoncolor = ButtonColor;


  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<boolean>();

  material!: MeshBasicMaterial;

  width = 0.1;

  side: Side = DoubleSide;


  override preInit() {
    super.preInit();

    if (!this.material) {
      this.material = new MeshBasicMaterial({ color: this.buttoncolor, side: this.side, opacity: 0.5, transparent: true });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.material.dispose();
  }

  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclicked(); e.stop = true; });
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.mesh = mesh;
  }

  clicked(event: NgtEvent<MouseEvent>) {
    event.stopPropagation();

    this.doclicked();
  }

  private doclicked() {
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
