import { Directive, OnDestroy, OnInit } from "@angular/core";

import { WebXRManager, XRHandSpace } from "three";
import { XRHandModelFactory } from "three-stdlib";

import { NgtStore } from "@angular-three/core";

import { XRControllerComponent } from "./xr-controller.component";


@Directive({
  selector: '[showhand]',
})
export class ShowHandDirective implements OnInit, OnDestroy {
  private hand!: XRHandSpace;

  constructor(
    private xr: XRControllerComponent,
    private store: NgtStore,
  ) {
  }
  ngOnDestroy(): void {
    const scene = this.store.get((s) => s.scene);
    scene.remove(this.hand);
  }
  ngOnInit(): void {
    const scene = this.store.get((s) => s.scene);

    let manager!: WebXRManager;

    this.xr.sessionstart.subscribe(xrmanager => {
      manager = xrmanager;
    });

    this.xr.connected.subscribe(next => {
      this.hand = manager.getHand(this.xr.index);

      const handModelFactory = new XRHandModelFactory();
      this.hand.add(handModelFactory.createHandModel(this.hand));
      scene.add(this.hand);
    });

    this.xr.disconnected.subscribe(next => {
      scene.remove(this.hand)
    });

  }
}
