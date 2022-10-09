import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Mesh, MeshBasicMaterial, Shape, ShapeGeometry, Side } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { ButtonColor, HoverColor, roundedRect, ToggleFalseColor, ToggleTrueColor } from "../flat-ui-utils";
import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-toggle',
  exportAs: 'flatUIInputToggle',
  templateUrl: './input-toggle.component.html',
})
export class FlatUIInputToggle extends NgtObjectProps<Mesh>{
  private _checked = false;
  @Input()
  get checked(): boolean { return this._checked }
  set checked(newvalue: boolean) {
    this._checked = newvalue;
    this.togglecolor = newvalue ? this.truecolor : this.falsecolor;

    if (this.togglemesh) {
      this.updatetoggle();
    }
  }

  @Input() buttoncolor = ButtonColor;
  @Input() hovercolor = HoverColor;

  @Input() enabled = true;
  @Input() falsecolor = ToggleFalseColor;
  @Input() truecolor = ToggleTrueColor;

  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<boolean>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  width = 0.2;

  side: Side = DoubleSide;
  togglecolor = this.falsecolor;

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
    this.selectable?.remove(this.togglemesh);

    this.geometry.dispose();
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


  private togglemesh!: Mesh;

  toggleready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclicked(); e.stop = true; });

    this.togglemesh = mesh;

    this.updatetoggle();

  }

  updatetoggle() {
    const offset = this.width / 4;
    this.togglemesh.position.x = this.checked ? offset : -offset;
  }

  clicked(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doclicked();
  }

  private doclicked() {
    if (!this.enabled || !this.visible) return;

    this.checked = !this.checked;
    this.change.next(this.checked);
  }

  over() {
    if (!this.enabled) return;

    this.material.color.setStyle(this.hovercolor);
  }
  out() {
    this.material.color.setStyle(this.buttoncolor);
  }


}
