import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Group, Vector3 } from "three";

import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { XRControllerComponent } from "../teleport/xr-controller/xr-controller.component";


@Directive({
  selector: '[shoot]',
})
export class ShootDirective implements OnInit, OnDestroy {
  private _shootEnabled: BooleanInput = true;
  @Input()
  get shoot(): boolean { return coerceBooleanProperty(this._shootEnabled) }
  set shoot(newvalue: BooleanInput) {
    this._shootEnabled = newvalue;
    this.isShooting = false;
  }
  @Input() room!: Group;

  private controller!: Group;
  private isShooting = false;
  private count = 0;

  private subs = new Subscription();

  constructor(
    private xr: XRControllerComponent,
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.room) {
      console.warn('Shoot directive requires room Group to be set');
      return;
    }

    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;
      this.controller = next.controller;
    }));

    this.subs.add(this.xr.triggerstart.subscribe(next => {
      if (this.shoot) this.isShooting = true;
    }));

    this.subs.add(this.xr.triggerend.subscribe(next => {
      if (this.shoot) this.isShooting = false;
    }));

    this.subs.add(this.xr.beforeRender.subscribe(next => {
      if (this.shoot) this.tick();
    }));
  }

  private tick() {
    if (this.room && this.controller && this.isShooting) {

      const object = this.room.children[this.count++];

      if (object) {
        object.position.copy(this.controller.position);
        const velocity: Vector3 = object.userData["velocity"];
        velocity.x = (Math.random() - 0.5) * 3;
        velocity.y = (Math.random() - 0.5) * 3;
        velocity.z = (Math.random() - 9);
        velocity.applyQuaternion(this.controller.quaternion);
      }
      if (this.count === this.room.children.length) this.count = 0;
    }
  }
}
