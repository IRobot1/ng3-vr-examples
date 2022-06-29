import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";

import { Group, Object3D, WebXRManager } from "three";

import { NgtRenderState, NgtStore } from "@angular-three/core";
import { WebARService } from "./webar.service";



@Component({
  selector: 'ar-controller',
  template: '<ngt-group (beforeRender)="tick($event)"></ngt-group>',
})
export class ARControllerComponent implements OnInit, OnDestroy {
  @Output() sessionstart = new BehaviorSubject<WebXRManager | undefined>(undefined)

  @Output() triggerstart = new EventEmitter<XRInputSource>()
  @Output() trigger = new EventEmitter<XRInputSource>()
  @Output() triggerend = new EventEmitter<XRInputSource>()

  @Output() beforeRender = new EventEmitter<NgtRenderState>()

  private controller!: Group;

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

    this.subs.add(this.webar.xrsession.subscribe(isPresenting => {
      if (isPresenting) {
        this.sessionstart.next(gl.xr);
      }
    }));

    const selectstart = (event: any) => {
      const data: XRInputSource = event['data'];
      this.triggerstart.next(data);
    }
    this.controller.addEventListener('selectstart', selectstart);

    const selectend = (event: any) => {
      this.trigger.next(event['data']);
      this.triggerend.next(event['data']);
    }
    this.controller.addEventListener('selectend', selectend);

    const select = (event: any) => {
      const data: XRInputSource = event['data'];
      this.trigger.next(data);
    }
    this.controller.addEventListener('select', select);


    this.cleanup = () => {
      this.controller.removeEventListener('select', select);
      this.controller.removeEventListener('selectend', selectend);
      this.controller.removeEventListener('selectstart', selectstart);
    }
  }

  tick(event: { state: NgtRenderState, object: Object3D }) {
    if (this.beforeRender.observed) {
      this.beforeRender.next(event.state);
    }
  }
}
