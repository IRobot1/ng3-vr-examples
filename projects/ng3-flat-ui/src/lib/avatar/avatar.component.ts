import { Component, Input } from "@angular/core";

import { Mesh, Texture, TextureLoader } from "three";
import { NgtLoader, NgtObjectProps } from "@angular-three/core";

import { GlobalFlatUITheme } from "../flat-ui-theme";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgtSobaText } from "@angular-three/soba/abstractions";
import { NgtCircleGeometry } from "@angular-three/core/geometries";
import { NgtMeshBasicMaterial } from "@angular-three/core/materials";
import { NgtObjectPassThrough } from "@angular-three/core";
import { CommonModule, NgIf } from "@angular/common";

@Component({
  selector: 'flat-ui-avatar',
  exportAs: 'flatUIAvatar',
  templateUrl: './avatar.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgtMesh,
    NgtObjectPassThrough,
    NgtSobaText,
    NgtCircleGeometry,
    NgtMeshBasicMaterial,
  ]
})
export class FlatUIAvatar extends NgtObjectProps<Mesh> {
  @Input()
  set url(newvalue: string) {
    if (!newvalue) return;

    const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
      this.maptexture = next;
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }
  @Input() radius = 0.07;
  @Input() initials = '';
  @Input() iconcolor: string = GlobalFlatUITheme.ButtonColor;

  protected maptexture!: Texture;

  constructor(private loader: NgtLoader) { super(); }
}
