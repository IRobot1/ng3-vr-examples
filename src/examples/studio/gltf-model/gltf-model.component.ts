import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Mesh } from 'three';
import { NgtTriple } from '@angular-three/core';

import { NgtGLTFLoader } from '@angular-three/soba/loaders';
 
@Component({
  selector: 'gltf-model',
  templateUrl: './gltf-model.component.html'
})
export class GLTFodelComponent {
  @Input() name = 'gltf-model';

  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() visible = true;

  @Input() set url(newvalue: string) {
    const s = this.loader.load(newvalue).subscribe(next => {
      console.warn(next.scene)
      const mesh = <Mesh>next.scene.children[0].children[0];
      this.mesh = mesh;
      this.loaded.emit(mesh);
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }

  @Output() loaded = new EventEmitter<Mesh>();

  protected mesh!: Mesh;

  constructor(private loader: NgtGLTFLoader) { }
}

