import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Mesh, Object3D } from "three";
import { NgtObjectProps } from "@angular-three/core";

@Component({
  selector: 'mesh-box-button',
  templateUrl: './mesh-box-button.component.html',
})
export class MeshBoxButtonComponent extends NgtObjectProps<Mesh> {
  @Input() buttoncolor = 'blue';
  @Input() textcolor = 'white';

  @Input() text!: string

  @Input() selectable?: Array<Object3D>;

  @Output() selected = new EventEmitter<Object3D>();


}
