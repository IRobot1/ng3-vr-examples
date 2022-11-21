import { AfterViewInit, Component, Input } from "@angular/core";

import { Material, Mesh } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgtPlaneGeometry } from "@angular-three/core/geometries";
import { NgtObjectPassThrough } from "@angular-three/core";

@Component({
  selector: 'flat-ui-divider',
  exportAs: 'flatUIDivider',
  templateUrl: './divider.component.html',
  standalone: true,
  imports: [
    NgtMesh,
    NgtPlaneGeometry,
    NgtObjectPassThrough,
  ]
})
export class FlatUIDivider extends NgtObjectProps<Mesh> implements AfterViewInit {

  private _width = 1;
  @Input()
  get width() { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: WIDTH_CHANGED_EVENT });
    }
  }

  private _height = 0.01;
  @Input()
  get height() { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

  private _dividermaterial!: Material
  @Input()
  get dividermaterial(): Material {
    if (this._dividermaterial) return this._dividermaterial;
    return GlobalFlatUITheme.OutlineMaterial;
  }
  set dividermaterial(newvalue: Material) {
    this._dividermaterial = newvalue;
  }

  protected mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.mesh = mesh;
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });
  }
}
