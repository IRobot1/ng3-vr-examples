import { Component, Input, OnInit } from "@angular/core";

import { Group } from "three";
import { coerceNumberProperty, NgtStore, NgtTriple, NumberInput } from "@angular-three/core";

import GUI from "lil-gui";
import { HTMLMesh } from "./HTMLMesh";

@Component({
  selector: 'ng3-lil-gui[gui]',
  template: '<ng-content></ng-content>',
})
export class Ng3LilGUIComponent {
  @Input()
  set gui(newvalue: GUI) {
    if (newvalue) {
      this.init(newvalue);
    }
  }

  @Input() position?: NgtTriple;
  @Input() rotation?: NgtTriple;
  @Input() scale?: NgtTriple;
  @Input() scalar?: NumberInput;

  private group = new Group();

  public mesh!: HTMLMesh;

  constructor(private store: NgtStore) { }

  private init(gui: GUI): void {
    gui.domElement.style.visibility = 'hidden';

    const mesh = new HTMLMesh(gui.domElement);
    if (this.position) {
      const p = this.position;
      mesh.position.set(p[0], p[1], p[2]);
    }
    if (this.rotation) {
      const e = this.rotation;
      mesh.rotation.set(e[0], e[1], e[2]);
    }
    if (this.scale) {
      const s = this.scale;
      mesh.scale.set(s[0], s[1], s[2])
    }
    if (this.scalar) {
      mesh.scale.setScalar(coerceNumberProperty(this.scalar))
    }

    const scene = this.store.get(s => s.scene);
    scene.add(this.group);

    this.group.add(mesh);

    this.mesh = mesh;
  }

  ngOnDestroy(): void {
    const scene = this.store.get(s => s.scene);
    scene.remove(this.group);
    this.mesh.dispose();
  }

}
