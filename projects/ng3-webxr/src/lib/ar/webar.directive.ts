import { Directive, Input, OnInit, Self } from "@angular/core";

import { NgtCanvas, NgtStore } from "@angular-three/core";

import { ARButton } from "three-stdlib";

import { WebARService } from "./webar.service";

@Directive({
  selector: '[webar]',
})
export class WebARDirective implements OnInit {
  @Input() referenceSpaceType: XRReferenceSpaceType = 'viewer';

  // https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession#session_features
  @Input() sessionInit: any;

  constructor(
    private store: NgtStore,
    private webar: WebARService,
    @Self() private parent: NgtCanvas, // cause runtime failure unless webvr directive on ngt-canvass
  ) { }

  ngOnInit(): void {
    if (!(this.parent instanceof NgtCanvas)) {
      console.warn('Add webar directive to ngt-canvas');
    }
    const gl = this.store.get((s) => s.gl);
    const scene = this.store.get((s) => s.scene);

    document.body.appendChild(ARButton.createButton(gl, this.sessionInit));

    this.webar.start(gl.xr, scene, this.referenceSpaceType);
  }
}
