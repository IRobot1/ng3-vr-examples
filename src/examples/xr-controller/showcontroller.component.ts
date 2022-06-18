import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Scene, XRGripSpace } from "three";

import { BooleanInput, coerceBooleanProperty, NgtStore } from "@angular-three/core";

import { XRControllerModelFactory } from "three-stdlib";

import { XRControllerComponent } from "./xr-controller.component";

@Directive({
  selector: '[showcontroller]',
})
export class ShowControllerDirective implements OnInit, OnDestroy {
  private _showEnabled: BooleanInput = true;
  @Input()
  get showcontroller(): boolean { return coerceBooleanProperty(this._showEnabled) }
  set showcontroller(newvalue: BooleanInput) {
    this._showEnabled = newvalue;
    if (this.grip) {
      if (newvalue)
        this.show();
      else
        this.hide();
    }
  }

  private scene!: Scene;
  private grip!: XRGripSpace;

  private subs = new Subscription();
  constructor(
    private xr: XRControllerComponent,
    private store: NgtStore,
  ) { }

  ngOnDestroy(): void {
    this.scene.remove(this.grip);
  }

  ngOnInit(): void {
    const renderer = this.store.get((s) => s.gl);
    this.scene = this.store.get((s) => s.scene);

    this.subs.add(this.xr.connected.subscribe(next => {
      const controllerModelFactory = new XRControllerModelFactory();

      this.grip = renderer.xr.getControllerGrip(this.xr.index);
      this.grip.add(controllerModelFactory.createControllerModel(this.grip));

      if (this.showcontroller) this.show();
    }));

    this.subs.add(this.xr.disconnected.subscribe(next => {
      if (this.showcontroller) this.hide();
    }));
  }

  private show() {
    this.scene.add(this.grip);
  }

  private hide() {
    this.scene.remove(this.grip);
  }
}
