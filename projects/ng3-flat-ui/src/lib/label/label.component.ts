import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group, Material, Object3D } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

export type LabelAlignX = 'left' | 'center' | 'right';
export type LabelAlignY = 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom';

@Component({
  selector: 'flat-ui-label',
  exportAs: 'flatUILabel',
  templateUrl: './label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUILabel extends NgtObjectProps<Group> implements AfterViewInit {
private _text = '';
  @Input()
  get text(): string { return this._text }
  set text(newvalue: string) {
    if (newvalue == undefined) newvalue = '';
    this._text = newvalue;
  }

  @Input() font = ''; // for example, https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff
  @Input() fontsize = 0.07;

  protected get x(): number {
    if (this.alignx == 'left') 
      return -this.width / 2 + 0.01;
    if (this.alignx == 'right') 
      return this.width / 2 - 0.01;
    return 0;
  }

  @Input() alignx: LabelAlignX  = 'left';
  @Input() aligny: LabelAlignY  = 'middle';

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

  private _width = 1;
  @Input()
  get width() { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: WIDTH_CHANGED_EVENT });
    }
  }

  private _height = 0.1;
  @Input()
  get height() { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      const height = this.height
      if (height) Math.max(this.height, this.fontsize);
      e.width = this.width;
      e.height = height;
      e.updated = true;
    });
  }

  private mesh!: Object3D;

  meshready(mesh: Object3D) {
    this.mesh = mesh;
  }
}
