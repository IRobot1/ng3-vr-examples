import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Object3D } from 'three';
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

  model$!: Observable<any>;

  @Input() set url(newvalue: string) {
     this.model$ = this.loader.load(newvalue);
  }

  constructor(private loader: NgtGLTFLoader) { }

  tick(scene: Object3D) {
    scene.rotation.y += 0.01;
  }
}

