import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Group, Object3D } from "three";
import { NgtTriple } from "@angular-three/core";

@Component({
  selector: 'mesh-box-button',
  templateUrl: './mesh-box-button.component.html',
})
export class MeshBoxButtonComponent {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  @Input() buttoncolor = 'blue';
  @Input() textcolor = 'white';

  @Input() text!: string

  @Input() selectable?: Array<Object3D>;

  @Output() buttonSelected = new EventEmitter<{ object: Object3D, data: any }>();

  addselectable(object: Object3D, group: Group) {
    this.selectable?.push(object);
    object.addEventListener('click', () => {
      this.buttonSelected.next({ object: group, data: object })
    })
  }

}
