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
  @Output() buttonHighlight = new EventEmitter<Object3D>();
  @Output() buttonUnhighlight = new EventEmitter<Object3D>();

  private cleanup = () => { }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.cleanup();
  }

  meshready(mesh: Mesh) {
    this.selectable?.push(mesh);

    let isOver = false;
    const mousemove = () => {
      if (!isOver) {
        this.buttonHighlight.next(mesh);
        isOver = true;
      }
    }

    mesh.addEventListener('mousemove', mousemove);

    const mouseout = () => {
      if (isOver) {
        this.buttonUnhighlight.next(mesh);
        isOver = false;
      }
    }
    mesh.addEventListener('mouseout', mouseout);

    this.cleanup = () => {
      mesh.removeEventListener('mousemove', mousemove);
      mesh.removeEventListener('mouseout', mouseout);
    }

  }
}
