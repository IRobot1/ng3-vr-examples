import { Directive, Input, OnInit } from "@angular/core";

import { Group, WebXRManager } from "three";

import { BooleanInput, coerceBooleanProperty, NgtStore } from "@angular-three/core";

import { XRControllerComponent } from "./xr-controller.component";

@Directive({
  selector: '[handinput]',
})
export class HandinputDirective implements OnInit {
  private _inputEnabled: BooleanInput = true;
  @Input()
  get handinput(): boolean { return coerceBooleanProperty(this._inputEnabled) }
  set handinput(newvalue: BooleanInput) {
    this._inputEnabled = newvalue;
    this.isSelecting = false;
  }

  private hand!: Group;
  private isSelecting = false;

  constructor(
    private xr: XRControllerComponent,
    private store: NgtStore,
  ) {
  }

  ngOnInit(): void {
    const scene = this.store.get((s) => s.scene);

    let manager!: WebXRManager;
    this.xr.sessionstart.subscribe(xrmanager => {
      if (!xrmanager) return;
      manager = xrmanager;
    });

    this.xr.connected.subscribe(next => {
      if (this.handinput) {
        this.hand = manager.getHand(this.xr.index);
      }
    });

    this.hand.addEventListener('pinchstart', (event) => {
      console.warn('pinchstart', event)
      const indexTip = event.target.joints['index-finger-tip'];
      this.isSelecting = true;
    });
    this.hand.addEventListener('pinchend', (event) => {
      console.warn('pinchend', event)
      this.isSelecting = false;
    });
    this.hand.addEventListener('pinch', (event) => {
      console.warn('pinch', event)
    });

  }

  private tick() {
  }

}
