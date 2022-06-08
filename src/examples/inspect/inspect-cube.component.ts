import { AfterContentInit, Component, Input } from "@angular/core";

import { NgtTriple } from "@angular-three/core";

import { NgtPhysicBody, NgtPhysicBodyReturn } from "@angular-three/cannon";
import { ColorRepresentation, Object3D } from "three";
import { Inspect } from "./inspect";

//
// Notice [userData]="{inspect: this}"
// Raycast intersection only returns THREE Object3D.
// Inspect interface is accessed via the 'inspect' userData property.
//

@Component({
  selector: 'inspect-cube',
  template: `
<ngt-mesh [ref]="body.ref" [position]="position" [rotation]="rotation" castShadow [userData]="{inspect: this}">
  <ngt-box-geometry [args]="size"></ngt-box-geometry>
  <ngt-mesh-standard-material [color]="color"></ngt-mesh-standard-material>
</ngt-mesh>
`,
  providers: [NgtPhysicBody]
})
export class InspectCube implements AfterContentInit, Inspect {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  @Input() size = [0.2, 0.2, 0.2] as NgtTriple;

  @Input() color: ColorRepresentation = 'white';
  @Input() mass = 1;

  body!: NgtPhysicBodyReturn<Object3D>; // part of Inspect interface

  constructor(
    private physicBody: NgtPhysicBody,
  ) { }

  ngAfterContentInit(): void {
    this.body = this.physicBody.useBox(() => ({
      mass: this.mass,
      args: this.size,
      position: this.position,
    }));
  }

  Pickup(): void {
    // when false, object in hand don't collide (like a ghost)
    // when true, they collide and can knock other objects over
    this.body.api.collisionResponse.set(false);
  }
  Drop(): void {
    this.body.api.collisionResponse.set(true);
  }
}
