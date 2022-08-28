import { Component } from "@angular/core";

import { Group, MathUtils, Object3D, Vector3 } from "three";
import { make, NgtObjectProps } from "@angular-three/core";

import { SpiroMeshComponent } from "../spiro-mesh/spiro-mesh.component";

@Component({
  selector: 'two-arm-spiro',
  templateUrl: './two-arm-spiro.component.html',
})
export class TwoArmSpiroComponent extends NgtObjectProps<Group> {

  arm1!: Object3D;
  arm2!: Object3D;

  private vectors: Array<Vector3> = [];

  private enabled = false;

  changex = true
  changez = true
  arm1length = 0.5
  arm2length = 0.1
  arm2factorx = 30
  arm2factorz = 0
  animate = false

  private origin!: Vector3;


  groupready(arm1: Group) {
    this.origin = make(Vector3, this.position);
    this.arm1 = arm1;
  }

  redraw() {
    this.angle = 0;
    this.vectors.length = 0;
    this.enabled = true;
  }

  private angle = 0;
  private speed = 90;

  tubemesh!: SpiroMeshComponent;

  tick(tip: Object3D) {
    if (this.enabled) {
      for (let i = 0; i < this.speed; i++) {
        if (this.angle <= 360) {

          this.arm1.rotation.z = -MathUtils.degToRad(this.angle);
          if (this.changex) {
            this.arm2.rotation.x = -MathUtils.degToRad(this.angle) * this.arm2factorx;
          }

          if (this.changez) {
            this.arm2.rotation.z = -MathUtils.degToRad(this.angle) * this.arm2factorz;
          }
          const next = new Vector3();
          const position = tip.getWorldPosition(next).sub(this.origin)
          if (this.angle < 360) this.vectors.push(position)

          this.arm1.updateMatrixWorld();

          this.angle += 0.5;
        }
      }
      if (this.angle <= 360) {
        this.tubemesh.refresh(this.vectors)
      }
      else {
        this.tubemesh.refresh(this.vectors, true)
        this.enabled = false;
      }
    }
    if (this.animate) {
      const rotation = this.tubemesh.instance.value.rotation;
      rotation.x = 0;
      rotation.y += 0.005;
      rotation.z = 0;
    }
  }

}
