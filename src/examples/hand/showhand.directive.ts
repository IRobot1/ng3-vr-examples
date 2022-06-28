import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Scene, WebXRManager, XRHandSpace } from "three";
import { XRHandModelFactory } from "three-stdlib";

import { BooleanInput, coerceBooleanProperty, NgtStore } from "@angular-three/core";

import { VRControllerComponent } from "ng3-webxr";


@Directive({
  selector: '[showhand]',
})
export class ShowHandDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get showhand(): boolean { return coerceBooleanProperty(this._enabled) }
  set showhand(newvalue: BooleanInput) {
    this._enabled = newvalue;
    if (this.hand) {
      if (newvalue)
        this.show();
      else
        this.hide();
    }
  }

  private hand!: XRHandSpace;
  private scene!: Scene;

  private subs = new Subscription();

  constructor(
    private xr: VRControllerComponent,
    private store: NgtStore,
  ) {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.scene = this.store.get((s) => s.scene);

    let manager!: WebXRManager;

    this.subs.add(this.xr.sessionstart.subscribe(xrmanager => {
      if (!xrmanager) return;
      manager = xrmanager;
    }));

    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;

      this.hand = manager.getHand(this.xr.index);

      const handModelFactory = new XRHandModelFactory();
      this.hand.add(handModelFactory.createHandModel(this.hand));

      if (this.showhand) this.show();
    }));

    this.subs.add(this.xr.disconnected.subscribe(next => {
      if (this.showhand) this.hide();
    }));

  }

  private hide() {
    this.scene.remove(this.hand);
  }

  private show() {
    this.scene.add(this.hand);
  }
}
