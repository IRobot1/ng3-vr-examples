import { Directive, Input, OnInit } from "@angular/core";

import { Group, Vector3 } from "three";

import { XRControllerComponent } from "../teleport/xr-controller/xr-controller.component";


@Directive({
  selector: '[shoot]',
})
export class ShootDirective implements OnInit {
  @Input() room!: Group;

  private controller!: Group;
  private isSelected = false;
  private count = 0;

  constructor(
    private xr: XRControllerComponent,
  ) { }

  ngOnInit(): void {
    if (!this.room) {
      console.warn('Shoot directive requires room Group to be set');
      return;
    }

    this.xr.connected.subscribe(next => {
      this.controller = next.controller;
    });

    this.xr.selectstart.subscribe(next => {
      this.isSelected = true;
    });

    this.xr.selectend.subscribe(next => {
      this.isSelected = false;
    });

    this.xr.beforeRender.subscribe(next => {
      this.tick();
    })
  }

  private tick() {
    if (this.room && this.controller && this.isSelected) {

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
