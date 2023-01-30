import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BufferGeometry, Group, Line, Material, Mesh, Shape, ShapeGeometry } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { GlobalFlatUITheme, roundedRect } from "ng3-flat-ui";

@Component({
  selector: 'chart-callout',
  exportAs: 'chartCallout',
  templateUrl: './chart-callout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartCallout extends NgtObjectProps<Group> {
  @Input() text: string = ''
  @Input() fontsize = 0.07;
  @Input() linkwidth = 0.2;
  @Input() linkheight = 0.1;

  private _calloutmaterial!: Material
  @Input()
  get calloutmaterial(): Material {
    if (this._calloutmaterial) return this._calloutmaterial;
    return GlobalFlatUITheme.PopupMaterial;
  }
  set calloutmaterial(newvalue: Material | undefined) {
    if (newvalue)
      this._calloutmaterial = newvalue;
  }

  private _linkmaterial!: Material
  @Input()
  get linkmaterial(): Material {
    if (this._linkmaterial) return this._linkmaterial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set linkmaterial(newvalue: Material | undefined) {
    if (newvalue)
      this._linkmaterial = newvalue;
  }

  private _outlinematerial!: Material
  @Input()
  get outlinematerial(): Material {
    if (this._outlinematerial) return this._outlinematerial;
    return GlobalFlatUITheme.OutlineMaterial;
  }
  set outlinematerial(newvalue: Material | undefined) {
    if (newvalue)
      this._outlinematerial = newvalue;
  }

  protected label!: Group;
  protected padding = 0.02;
  protected width = 0;

  protected buildCalloutShape(width: number, calloutmesh: Mesh, outlinemesh: Line, horizlink: Mesh, vertlink: Mesh) {
    if (width == this.width) return;
    this.width = width;

    if (calloutmesh.geometry) calloutmesh.geometry.dispose();
    if (outlinemesh.geometry) outlinemesh.geometry.dispose();

    const flat = new Shape();
    const height = this.fontsize + this.padding * 2;
    roundedRect(flat, 0, 0, width + this.padding * 2, height, height / 2);

    calloutmesh.geometry = new ShapeGeometry(flat);
    calloutmesh.geometry.center();

    outlinemesh.geometry = new BufferGeometry().setFromPoints(flat.getPoints());
    outlinemesh.geometry.center();

    const offset = width / 2 + this.padding + this.linkwidth + 0.005;
    calloutmesh.position.set(-offset, this.linkheight - 0.005, 0)
    outlinemesh.position.set(-offset, this.linkheight - 0.005, 0)
    this.label.position.set(-offset, this.linkheight - 0.005, 0)

    horizlink.position.set(-this.linkwidth / 2 - 0.005, this.linkheight - 0.005, 0);
    vertlink.position.set(0, this.linkheight / 2, 0);
  }
}
