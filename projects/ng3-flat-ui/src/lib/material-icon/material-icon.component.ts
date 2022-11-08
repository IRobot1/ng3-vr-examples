import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group, Material, Object3D } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

@Component({
  selector: 'flat-ui-material-icon',
  exportAs: 'flatUIMaterialIcon',
  templateUrl: './material-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIMaterialIcon extends NgtObjectProps<Group> implements AfterViewInit {
  private _text = '';
  @Input()
  get text(): string { return this._text }
  set text(newvalue: string) {
    if (newvalue == undefined) newvalue = '';
    this._text = newvalue;
  }

  @Input() fontsize = 0.07;

  @Input() enabled = false; // doesn't do anything, just avoids error when switching from input-textarea or input-text

  private _labelmaterial!: Material
  @Input()
  get labelmaterial(): Material {
    if (this._labelmaterial) return this._labelmaterial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set labelmaterial(newvalue: Material) {
    this._labelmaterial = newvalue;
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.fontsize;
      e.height = this.fontsize;
      e.updated = true;
    });
  }

  private mesh!: Object3D;

  meshready(mesh: Object3D) {
    this.mesh = mesh;
  }
}
