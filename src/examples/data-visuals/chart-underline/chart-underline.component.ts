import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BufferGeometry, Group, Line, Material, Mesh, Shape, ShapeGeometry } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { GlobalFlatUITheme, roundedRect } from "ng3-flat-ui";

@Component({
  selector: 'chart-underline',
  exportAs: 'chartUnderline',
  templateUrl: './chart-underline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartUnderline extends NgtObjectProps<Group> {
  @Input() length = 0.5;

  private _underlinematerial!: Material
  @Input()
  get underlinematerial(): Material {
    if (this._underlinematerial) return this._underlinematerial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set underlinematerial(newvalue: Material | undefined) {
    if (newvalue)
      this._underlinematerial = newvalue;
  }
}
