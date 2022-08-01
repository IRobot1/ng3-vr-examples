import { Component, Input, OnInit } from "@angular/core";

import { Euler, Group, Vector3 } from "three";

import GUI from "lil-gui";

import { HTMLMesh } from "./HTMLMesh";
import { coerceNumberProperty, make, NgtStore, NgtTriple, NumberInput } from "@angular-three/core";

@Component({
  selector: 'ng3-lil-gui[gui]',
  template: '',
})
export class Ng3LilGUIComponent implements OnInit {
  @Input() gui!: GUI;

  @Input() position?: NgtTriple;
  @Input() rotation?: NgtTriple;
  @Input() scale?: NgtTriple;
  @Input() scalar?: NumberInput;

  public group = new Group();

  private mesh!: HTMLMesh;

  constructor(private store: NgtStore) { }

  ngOnInit(): void {
    this.gui.domElement.style.visibility = 'hidden';

    const mesh = new HTMLMesh(this.gui.domElement);
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
