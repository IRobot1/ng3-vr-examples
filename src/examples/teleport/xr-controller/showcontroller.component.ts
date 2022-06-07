import { Directive, OnDestroy, OnInit } from "@angular/core";

import { NgtStore } from "@angular-three/core";

import { XRControllerModelFactory } from "three-stdlib";

import { XRControllerComponent } from "./xr-controller.component";
import { XRGripSpace } from "three";

@Directive({
  selector: '[showcontroller]',
})
export class ShowControllerDirective implements OnInit, OnDestroy {
  private grip!: XRGripSpace;

  constructor(
    private xr: XRControllerComponent,
    private store: NgtStore,
  ) { }

  ngOnDestroy(): void {
    const scene = this.store.get((s) => s.scene);
    scene.remove(this.grip);
    console.warn('remove grip')
  }

  ngOnInit(): void {
    const renderer = this.store.get((s) => s.gl);
    const scene = this.store.get((s) => s.scene);

    this.xr.connected.subscribe(next => {
      const controllerModelFactory = new XRControllerModelFactory();

      this.grip = renderer.xr.getControllerGrip(this.xr.index);
      this.grip.add(controllerModelFactory.createControllerModel(this.grip));
      scene.add(this.grip);
    });

    this.xr.disconnected.subscribe(next => {
      scene.remove(this.grip);
    });
  }
}
