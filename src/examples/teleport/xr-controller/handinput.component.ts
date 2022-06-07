import { Directive, OnInit } from "@angular/core";

import { Group, WebXRManager } from "three";

import { NgtStore } from "@angular-three/core";

import { XRHandModelFactory } from "three-stdlib";

import { XRControllerComponent } from "./xr-controller.component";

@Directive({
  selector: '[handinput]',
})
export class HandinputDirective implements OnInit {
  private hand?: Group;
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
      manager = xrmanager;
    });

    this.xr.connected.subscribe(next => {
      const hand = manager.getHand(this.xr.index);

      hand.addEventListener('pinchstart', (event) => {
        console.warn('pinchstart', event)
        const controller = <Group>event.target;
        const indexTip = event.target.joints['index-finger-tip'];
        this.isSelecting = true;
      });
      hand.addEventListener('pinchend', (event) => {
        console.warn('pinchend', event)
        const controller = <Group>event.target;
        this.isSelecting = false;
      });
      hand.addEventListener('pinch', (event) => {
        console.warn('pinch', event)
      });
    });
  }

  private tick() {
  }

}
