import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";

import { Object3D, Scene, WebXRManager, XRHandSpace } from "three";
import { XRHandModelFactory, XRHandPrimitiveModel } from "three-stdlib";

import { BooleanInput, coerceBooleanProperty, NgtStore } from "@angular-three/core";

import { VRControllerComponent } from "ng3-webxr";

export type HandModelType = 'spheres' | 'boxes';// | 'mesh';

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

  private _modeltype: HandModelType = 'spheres';
  @Input()
  get handModelType(): HandModelType { return this._modeltype }
  set handModelType(newvalue: HandModelType) {

    this.showHandModel(this._modeltype, false);
    this._modeltype = newvalue;

    if (this.hand) {
      this.showHandModel(newvalue);
    }
  }

  @Output() handJoints = new EventEmitter<{ [key: string]: Object3D }>();

  private handModels = new Map<string, Object3D>([]);

  private model!: any;
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

      const hand = manager.getHand(this.xr.index);

      const handModelFactory = new XRHandModelFactory();
      this.handModels.set('boxes', handModelFactory.createHandModel(hand, 'boxes'));
      this.handModels.set('spheres', handModelFactory.createHandModel(hand, 'spheres'));
      //this.handModels.set('mesh', handModelFactory.createHandModel(hand, 'mesh' as any));

      Array.from(this.handModels.values()).forEach(model => {
        model.visible = false;
        hand.add(model);
      });
      this.showHandModel(this.handModelType);

      this.hand = hand;

      manager.getSession()?.requestAnimationFrame(() => {
        this.handJoints.next(((this.model.motionController as XRHandPrimitiveModel).controller as any).joints);
      })
      if (this.showhand) this.show();
    }));

    this.subs.add(this.xr.disconnected.subscribe(next => {
      if (this.showhand) this.hide();
    }));

  }

  private showHandModel(modeltype: HandModelType, visible = true) {
    this.model = this.handModels.get(modeltype);
    if (this.model) this.model.visible = visible;
  }

  private hide() {
    this.scene.remove(this.hand);
  }

  private show() {
    this.scene.add(this.hand);
  }
}
