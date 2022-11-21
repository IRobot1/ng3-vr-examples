import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Scene, XRGripSpace } from "three";

import { BooleanInput, coerceBooleanProperty, NgtStore } from "@angular-three/core";

import { XRControllerModel, XRControllerModelFactory } from "three-stdlib";

import { VRControllerComponent } from "./vr-controller.component";

@Directive({
  selector: '[showcontroller]',
  exportAs: 'showController',
  standalone: true,
})
export class ShowControllerDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get showcontroller(): boolean { return coerceBooleanProperty(this._enabled) }
  set showcontroller(newvalue: BooleanInput) {
    this._enabled = newvalue;
    if (this.grip) {
      if (newvalue)
        this.show();
      else
        this.hide();
    }
  }

  private scene!: Scene;
  private grip!: XRGripSpace;
  private model!: XRControllerModel;

  private subs = new Subscription();
  constructor(
    private xr: VRControllerComponent,
    private store: NgtStore,
  ) { }

  ngOnDestroy(): void {
    if (this.grip) {
      this.grip.remove(this.model);
    }
    this.hide();
  }

  ngOnInit(): void {
    const renderer = this.store.get((s) => s.gl);
    this.scene = this.store.get((s) => s.scene);

    this.subs.add(this.xr.connected.subscribe(next => {
      const controllerModelFactory = new XRControllerModelFactory();

      this.grip = renderer.xr.getControllerGrip(this.xr.index);
      this.model = controllerModelFactory.createControllerModel(this.grip)
      this.grip.add(this.model);

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
