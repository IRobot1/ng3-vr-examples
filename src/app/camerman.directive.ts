import { Directive, Input, OnInit, Self } from "@angular/core";

import { PerspectiveCamera } from 'three';

import { NgtCanvas, NgtStore, NgtTriple } from "@angular-three/core";
import { CameraService } from "./camera.service";

@Directive({
  selector: '[cameraman]',
  exportAs: 'cameraman',
})
export class CameraManagerDirective implements OnInit {

  constructor(
    private store: NgtStore,
    private cameraService: CameraService,
    @Self() private parent: NgtCanvas, // cause runtime failure unless webvr directive on ngt-canvass
  ) { }

  ngOnInit(): void {
    if (!(this.parent instanceof NgtCanvas)) {
      console.warn('Add cameraman directive to ngt-canvas');
    }
    const camera = this.store.get((s) => s.camera);
    
    this.cameraService.start(camera as PerspectiveCamera);
  }
}
