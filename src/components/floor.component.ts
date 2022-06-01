import { Component, Input } from "@angular/core";

import { NgtPhysicBody } from "@angular-three/cannon";
import { NgtTriple } from "@angular-three/core";

@Component({
  selector: 'floor',
  template: `
      <ngt-mesh [ref]="planeProps.ref" [name]="name" [position]="position" receiveShadow>
        <ngt-plane-geometry [args]="[100, 100]"></ngt-plane-geometry>
        <ngt-mesh-standard-material [color]="color"></ngt-mesh-standard-material>
      </ngt-mesh>`,
  providers: [NgtPhysicBody],
})

export class FloorComponent {
  @Input() name = 'floor';
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() friction = 1;
  @Input() color = '#777777';

  planeProps = this.physicBody.usePlane(() => ({
    mass: 0,
    material: { friction: this.friction, restitution: 1 },
    position: this.position,
    rotation: [-1.57, 0, 0]
  }));


  constructor(private physicBody: NgtPhysicBody) { }

}
