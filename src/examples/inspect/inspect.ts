import { Object3D } from "three";

import { NgtPhysicBodyReturn } from "@angular-three/cannon";

export interface Inspect {
  Pickup(): void;
  Drop(): void;
  body: NgtPhysicBodyReturn<Object3D>;
}
