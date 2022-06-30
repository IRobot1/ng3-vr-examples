import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";

import { Object3D, WebXRManager } from "three";

import { NgtRenderState, NgtStore } from "@angular-three/core";

import { WebARService } from "./webar.service";

export class TapEvent {
  data!: XRInputSource;
  controller!: Object3D;
}

@Component({
  selector: 'ar-controller',
  template: '<ngt-group (beforeRender)="tick($event)"></ngt-group>',
})
export class ARControllerComponent implements OnInit, OnDestroy {
  @Output() sessionstart = new BehaviorSubject<WebXRManager | undefined>(undefined)

  @Output() tap = new EventEmitter<TapEvent>()

  @Output() beforeRender = new EventEmitter<NgtRenderState>()

  private controller!: Object3D;

  private subs = new Subscription();
  private cleanup = () => { }

  constructor(
    private webar: WebARService,
    private store: NgtStore,
  ) {
  }

  ngOnDestroy(): void {
    this.cleanup();
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.webar.manager) {
      console.error('webar directive missing from ngt-canvas');
      return;
    }
    const gl = this.store.get((s) => s.gl);

    this.subs.add(this.webar.isPresenting.subscribe(isPresenting => {
      if (isPresenting) {
        this.sessionstart.next(gl.xr);
      }
    }));

    this.controller = this.webar.controller;

    const select = (event: any) => {
      const data: XRInputSource = event['data'];
      this.tap.next({ data: data, controller: this.controller});
    }
    this.controller.addEventListener('select', select);


    this.cleanup = () => {
      this.controller.removeEventListener('select', select);
    }
  }

  tick(event: { state: NgtRenderState, object: Object3D }) {
    if (this.beforeRender.observed) {
      this.beforeRender.next(event.state);
    }
  }
}
