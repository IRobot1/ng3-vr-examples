import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Group, Object3D, Vector3 } from "three";

import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";
import { NgtPhysicBody, NgtPhysicBodyReturn } from "@angular-three/cannon";

import { XRControllerComponent } from "../teleport/xr-controller/xr-controller.component";


@Directive({
  selector: '[drumstick]',
  providers: [NgtPhysicBody],
})
export class DrumstickDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get drumstick(): boolean { return coerceBooleanProperty(this._enabled) }
  set drumstick(newvalue: BooleanInput) {
    this._enabled = newvalue;

    if (this.collision) this.drumAllowed();
  }
  @Input() stick!: Object3D;
  @Input() socket!: Object3D;

  private controller!: Group;

  private collisionRadius = 0.025;
  private collision!: NgtPhysicBodyReturn<Object3D>;

  private subs = new Subscription();

  constructor(
    private xr: XRControllerComponent,
    private physicBody: NgtPhysicBody,
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.stick) {
      console.warn('drumstick directive missing stick Object3D');
    }

    this.collision = this.physicBody.useSphere(() => ({
      type: 'Dynamic',
      args: [this.collisionRadius],
    }), false);

    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;
      this.controller = next.controller;
    }));

    this.subs.add(this.xr.beforeRender.subscribe(next => {
      this.tick();
    }));

    this.drumAllowed();
  }

  private drumAllowed() {
    this.collision.ref.value.name = this._enabled ? 'stick' : '';
  }

  private tick() {
    if (this.controller) {
      let position: Vector3;
      if (this.socket) {
        position = new Vector3();
        this.socket.localToWorld(position);
      }
      else {
        position = this.controller.position;
      }
      const rotation = this.controller.rotation;

      // move the collision sphere with controller
      this.collision.api.position.copy(position);
      this.collision.api.rotation.copy(rotation);

      // move asset visual
      this.stick.position.copy(this.controller.position);
      this.stick.rotation.copy(this.controller.rotation);
    }
  }
}
