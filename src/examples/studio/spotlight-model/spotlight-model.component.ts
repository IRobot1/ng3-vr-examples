import { Component, Input } from "@angular/core";

import { NgtTriple } from "@angular-three/core";

import { CylinderArgs, NgtPhysicBody } from "@angular-three/cannon";

import { Inspect } from "../../inspect/inspect";

@Component({
  selector: 'spotlight-model',
  templateUrl: './spotlight-model.component.html',
  providers: [NgtPhysicBody],
})
export class SpotlightModelComponent implements Inspect {
  @Input() id = '1';
  @Input() color = 'white';
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;

  handleArgs = [0.02, 0.02, 0.2, 20] as CylinderArgs;

  body = this.physicBody.useCylinder(() => ({
    type: 'Dynamic',
    mass: 0,
    args: this.handleArgs,
    position: this.position,
  }));

  constructor(
    private physicBody: NgtPhysicBody,
  ) { }

  Pickup(): void {
    // give is mass, so it can move
    this.body.api.mass.set(1);
  }
  Drop(): void {
    // freeze when dropped
    this.body.api.mass.set(0);
    this.body.api.velocity.set(0, 0, 0);
  }
}

