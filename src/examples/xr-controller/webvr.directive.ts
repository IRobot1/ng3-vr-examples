import { Directive, Input, OnInit, Self } from "@angular/core";

import { NgtCanvas, NgtStore } from "@angular-three/core";

import { VRButton } from "three-stdlib";

import { WebVRService } from "./webvr.service";

@Directive({
  selector: '[webvr]',
})
export class WebVRDirective implements OnInit {
  @Input() referenceSpaceType: XRReferenceSpaceType = 'local-floor';

  constructor(
    private store: NgtStore,
    private webvr: WebVRService,
    @Self() private parent: NgtCanvas, // cause runtime failure unless webvr directive on ngt-canvass
  ) { }

  ngOnInit(): void {
    if (!(this.parent instanceof NgtCanvas)) {
      console.warn('Add webvr directive to ngt-canvas');
    }
    const gl = this.store.get((s) => s.gl);
    const scene = this.store.get((s) => s.scene);

    document.body.appendChild(VRButton.createButton(gl));

    this.webvr.start(gl.xr, scene, this.referenceSpaceType);
  }
}
