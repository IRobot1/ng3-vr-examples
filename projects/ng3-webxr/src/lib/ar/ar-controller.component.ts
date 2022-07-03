import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";

import { Group, Object3D, WebXRManager } from "three";

import { NgtRenderState, NgtStore } from "@angular-three/core";

import { WebARService } from "./webar.service";

@Component({
  selector: 'ar-controller',
  template: '<ngt-group (beforeRender)="tick($event)"></ngt-group>',
})
export class ARControllerComponent implements OnInit, OnDestroy {
  @Input() index = 0;

  @Output() sessionstart = new BehaviorSubject<WebXRManager | undefined>(undefined)

  @Output() tapstart = new EventEmitter<XRInputSource>()
  @Output() tap = new EventEmitter<XRInputSource>()
  @Output() tapend = new EventEmitter<XRInputSource>()

  @Output() beforeRender = new EventEmitter<NgtRenderState>()

  controller!: Group;

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

    switch (this.index) {
      case 0:
        this.controller = this.webar.finger1Controller;
        break;
      case 1:
        this.controller = this.webar.finger2Controller;
        break;
      default:
        console.error('ar-controler unhandled index', this.index);
        return;
    }

    const selectstart = (event: any) => {
      this.tapstart.next(event['data']);
    }
    this.controller.addEventListener('selectstart', selectstart);

    const selectend = (event: any) => {
      this.tapend.next(event['data']);
    }
    this.controller.addEventListener('selectend', selectend);

    const select = (event: any) => {
      this.tap.next(event['data']);
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
