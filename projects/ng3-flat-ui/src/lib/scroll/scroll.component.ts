import { Component, Input } from "@angular/core";

import { Group, Mesh } from "three";
import { NgtObjectPassThrough, NgtObjectProps } from "@angular-three/core";
import { NgtCircleGeometry, NgtRingGeometry } from "@angular-three/core/geometries";
import { NgtMesh } from "@angular-three/core/meshes";

import { NgtMeshBasicMaterial } from "@angular-three/core/materials";

@Component({
  selector: 'flat-ui-scroll',
  exportAs: 'flatUIScroll',
  templateUrl: './scroll.component.html',
  standalone: true,
  imports: [
    NgtMesh,
    NgtRingGeometry,
    NgtCircleGeometry,
    NgtMeshBasicMaterial,
    NgtObjectPassThrough,
  ]
})
export class FlatUIScroll extends NgtObjectProps<Mesh> {
  indicator!: Mesh;
  mesh!: Mesh;
}
