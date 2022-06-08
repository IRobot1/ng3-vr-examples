import { NgtPhysicBody, NgtPhysicBodyReturn, NgtPhysicConstraint, NgtPhysicConstraintReturn } from "@angular-three/cannon";
import { Directive, Input, OnInit } from "@angular/core";

import { Group, Object3D } from "three";

import { XRControllerComponent } from "../teleport/xr-controller/xr-controller.component";
import { Inspect } from "./inspect";


@Directive({
  selector: '[grab]',
  providers: [NgtPhysicBody, NgtPhysicConstraint],
})
export class GrabDirective implements OnInit {
  @Input() room!: Group;

  private controller!: Group;

  markerRadius = 0.01;
  marker!: NgtPhysicBodyReturn<Object3D>;

  collisionRadius = 0.05;
  collision!: NgtPhysicBodyReturn<Object3D>;

  constructor(
    private xr: XRControllerComponent,
    private physicBody: NgtPhysicBody,
    private physicConstraint: NgtPhysicConstraint,
  ) { }

  ngOnInit(): void {
    if (!this.room) {
      console.warn('Grab directive requires room Group to be set');
      return;
    }

    this.marker = this.physicBody.useSphere(() => ({
      mass: 0,
      args: [this.markerRadius],
      collisionResponse: false,
    }), false);

    this.collision = this.physicBody.useSphere(() => ({
      isTrigger: true,
      args: [this.collisionRadius],

      onCollideBegin: (e) => {
        if (e.body != this.overlapping) {
          this.overlapping = e.body;
        }
      },
      onCollideEnd: (e) => {
        if (e.body == this.overlapping) {
          this.overlapping = undefined;
        }
      },
    }), false);

    this.xr.connected.subscribe(next => {
      this.controller = next.controller;
    });

    this.xr.selectstart.subscribe(next => {
      this.pickup();
    });

    this.xr.selectend.subscribe(next => {
      this.drop();
    });

    this.xr.beforeRender.subscribe(next => {
      this.tick();
    })
  }

  private overlapping?: Object3D;
  private inspecting?: Inspect;

  private constraint!: NgtPhysicConstraintReturn<'PointToPoint'>;

  private pickup() {
    if (this.overlapping && !this.inspecting) {
      // Objects that implement the Inspect interface must store in userData 'inspect' property.
      // See inspect-cube.component.ts
      //
      const inspect = <Inspect>this.overlapping.userData['inspect'];
      if (inspect) {
        inspect.Pickup();
        this.constraint = this.physicConstraint.usePointToPointConstraint(
          inspect.body.ref,
          this.marker.ref,
          {
            pivotA: [0, 0, 0], pivotB: [0, 0, 0],
          });
        this.inspecting = inspect;
      }
    }

  }

  private drop() {
    if (this.inspecting) {
      this.inspecting.Drop();
      this.inspecting.body.api.angularFactor.set(1, 1, 1);  // allow normal rotation again

      this.constraint.api.remove();
      this.inspecting = undefined;
    }
  }

  private tick() {
    if (this.room && this.controller) {
      const position = this.controller.position
      const rotation = this.controller.rotation;

      // move the collision sphere with controller
      this.collision.api.position.copy(position);
      this.collision.api.rotation.copy(rotation);

      // move marker for attaching grabbed things
      this.marker.api.position.copy(position);
      this.marker.api.rotation.copy(rotation);

      // rotate the thing being inspected to match the controller rotation
      if (this.inspecting) {
        this.inspecting.body.api.angularFactor.set(0, 0, 0); // stop it shaking
        this.inspecting.body.api.rotation.copy(rotation);
      }
    }
  }
}
