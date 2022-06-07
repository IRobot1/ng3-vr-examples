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
      const handModelFactory = new XRHandModelFactory();

      this.hand = manager.getHand(this.xr.index);
      this.hand.add(handModelFactory.createHandModel(this.hand));
      scene.add(this.hand);

      this.hand.addEventListener('pinchstart', (event) => {
        console.warn('pinchstart', event)
        const controller = <Group>event.target;
        const indexTip = event.target.joints['index-finger-tip'];
        this.isSelecting = true;
      });
      this.hand.addEventListener('pinchend', (event) => {
        console.warn('pinchend', event)
        const controller = <Group>event.target;
        this.isSelecting = false;
      });
      this.hand.addEventListener('pinch', (event) => {
        console.warn('pinch', event)
      });
    });
  }

  private tick() {
  }

}
