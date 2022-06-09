import { Directive, Input, OnInit } from "@angular/core";

import { Group, Object3D, Vector3 } from "three";

import { NgtPhysicBody, NgtPhysicBodyReturn } from "@angular-three/cannon";

import { XRControllerComponent } from "../teleport/xr-controller/xr-controller.component";


@Directive({
  selector: '[drumstick]',
  providers: [NgtPhysicBody],
})
export class DrumstickDirective implements OnInit {
  @Input() stick!: Object3D;
  @Input() socket!: Object3D;

  private controller!: Group;

  private collisionRadius = 0.025;
  private collision!: NgtPhysicBodyReturn<Object3D>;

  constructor(
    private xr: XRControllerComponent,
    private physicBody: NgtPhysicBody,
  ) { }

  ngOnInit(): void {
    if (!this.stick) {
      console.warn('drumstick directive missing stick Object3D');
    }

    this.collision = this.physicBody.useSphere(() => ({
      type: 'Dynamic',
      args: [this.collisionRadius],
    }), false);
    this.collision.ref.value.name = 'stick';

    this.xr.connected.subscribe(next => {
      this.controller = next.controller;
    });

    this.xr.beforeRender.subscribe(next => {
      this.tick();
    })
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
