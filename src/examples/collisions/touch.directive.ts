import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";

import { Group, Mesh, Object3D } from "three";

import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { VRControllerComponent } from "ng3-webxr";

import { Collider, CollisionGroup } from "./collision";


@Directive({
  selector: '[touch]',
})
export class TouchDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get touch(): boolean { return coerceBooleanProperty(this._enabled) }
  set touch(newvalue: BooleanInput) {
    this._enabled = newvalue;
  }
  @Input() finger!: Object3D;
  @Input() collider!: Mesh;  // changing collider after init not supported

  @Input() collisionGroup?: CollisionGroup;

  @Output() collidebegin = new EventEmitter<Mesh>()
  @Output() colliding = new EventEmitter<Mesh>()
  @Output() collideend = new EventEmitter<Mesh>()

  private controller!: Group;

  private subs = new Subscription();
  private cleanup = () => { }

  constructor(
    private xr: VRControllerComponent,
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.cleanup();
  }

  ngOnInit(): void {
    if (!this.collider) {
      console.warn('touch directive missing collider Mesh');
      return;
    }

    let connected = false;
    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;
      this.controller = next.controller;
      connected = true;
    }));

    this.subs.add(this.xr.disconnected.subscribe(next => {
      connected = false;
    }));

    const collidebegin = (event: any) => {
      if (this.collidebegin.observed)
        this.collidebegin.next(event.object);
    }
    this.collider.addEventListener('collidebegin', collidebegin);

    const colliding = (event: any) => {
      if (this.colliding.observed)
        this.colliding.next(event.object);
    }
    this.collider.addEventListener('colliding', colliding);

    const collideend = (event: any) => {
      if (this.collideend.observed)
        this.collideend.next(event.object);
    }
    this.collider.addEventListener('collideend', collideend);


    this.cleanup = () => {
      this.collider.removeEventListener('collidebegin', collidebegin);
      this.collider.removeEventListener('colliding', colliding);
      this.collider.removeEventListener('collideend', collideend);
    }

    let collider!: Collider;
    if (this.collider.geometry.type == 'SphereGeometry')
      collider = new Collider(this.collider, 'sphere');
    else if (this.collider.geometry.type == 'BoxGeometry')
      collider = new Collider(this.collider, 'box');
    else
      console.warn(this.collider.geometry.type)

    // run collision at a slower frame rate
    setInterval(() => {
      if (this.controller) {
        if (this.touch && connected) {
          if (collider.hint == 'sphere')
            this.collisionGroup?.checkSphereCollision(collider);
          else
            this.collisionGroup?.checkBoxCollision(collider);
        }

        // move finger tip mesh
        if (this.finger) {
          this.finger.position.copy(this.controller.position);
          this.finger.rotation.copy(this.controller.rotation);
        }

      }
    }, 1000 / 24)
  }
}
