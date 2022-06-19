import { NgtCanvas, NgtStore } from "@angular-three/core";
import { Directive, OnInit, Self } from "@angular/core";
import { WebXRService } from "./webxr.service";

@Directive({
  selector: '[webxr]',
})
export class WebXRDirective implements OnInit {
  constructor(
    private store: NgtStore,
    private webxr: WebXRService,
    @Self() private parent: NgtCanvas, // cause runtime failure unless webxr directive on ngt-canvass
  ) { }

  ngOnInit(): void {
    //if (!(this.parent instanceof NgtCanvas)) {
    //  console.warn('Add webxr directive to ngt-canvas');
    //}
    const gl = this.store.get((s) => s.gl);
    const scene = this.store.get((s) => s.scene);

    this.webxr.start(gl.xr, scene);
  }
}
