import { Object3D } from "three";

import { NgtPhysicBodyReturn } from "@angular-three/cannon";

export interface Inspect {
  Pickup(): void;
  Drop(): void;
  physics: NgtPhysicBodyReturn<Object3D>;
}
