import { Component, Input } from "@angular/core";

import { Group, MathUtils, Object3D, Vector3 } from "three";
import { make, NgtObjectProps, NgtStore } from "@angular-three/core";

import { SpiroMeshComponent } from "../spiro-mesh/spiro-mesh.component";

@Component({
  selector: 'two-arm-spiro',
  templateUrl: './two-arm-spiro.component.html',
})
export class TwoArmSpiroComponent extends NgtObjectProps<Group> {
  @Input() tubecolor = '#6495ED'; // cornflowerblue

  arm1!: Object3D;
  arm2!: Object3D;

  private vectors: Array<Vector3> = [];

  private enabled = false;

  private _changex = true
  get changex(): boolean { return this._changex }
  set changex(newvalue: boolean) {
    this._changex = newvalue;
    this.redraw();
  }

  private _changey = false
  get changey(): boolean { return this._changey }
  set changey(newvalue: boolean) {
    this._changey = newvalue;
    this.redraw();
  }

  private _changez = true
  get changez(): boolean { return this._changez }
  set changez(newvalue: boolean) {
    this._changez = newvalue;
    this.redraw();
  }

  private _radius = 0.01;
  get radius(): number { return this._radius }
  set radius(newvalue: number) {
    this._radius = newvalue;
    this.redraw();
  }

  private _arm1length = 0.5
  get arm1length(): number { return this._arm1length }
  set arm1length(newvalue: number) {
    this._arm1length = newvalue;
    this.redraw();
  }

  private _arm2length = 0.1
  get arm2length(): number { return this._arm2length }
  set arm2length(newvalue: number) {
    this._arm2length = newvalue;
    this.redraw();
  }

  private _arm2factorx = 30
  get arm2factorx(): number { return this._arm2factorx }
  set arm2factorx(newvalue: number) {
    this._arm2factorx = newvalue;
    this.redraw();
  }

  private _arm1factory = 0
  get arm1factory(): number { return this._arm1factory }
  set arm1factory(newvalue: number) {
    this._arm1factory = newvalue;
    this.redraw();
  }

  private _arm2factorz = 0
  get arm2factorz(): number { return this._arm2factorz }
  set arm2factorz(newvalue: number) {
    this._arm2factorz = newvalue;
    this.redraw();
  }

  animate = true

  private origin!: Vector3;

  

  groupready(arm1: Group) {
    this.origin = make(Vector3, this.position);
    this.arm1 = arm1;
  }

  redraw() {
    if (!this.enabled) {
      this.angle = 0;
      this.vectors.length = 0;
      this.enabled = true;
    }
  }

  private angle = 0;
  public speed = 90;

  tubemesh!: SpiroMeshComponent;

  tick(tip: Object3D) {
    if (this.enabled) {
      for (let i = 0; i < this.speed; i++) {
        if (this.angle <= 360) {

          this.arm1.rotation.z = -MathUtils.degToRad(this.angle);
          if (this.changex) {
            this.arm2.rotation.x = -MathUtils.degToRad(this.angle) * this.arm2factorx;
          }

          if (this.changey) {
            this.arm1.rotation.x = -MathUtils.degToRad(this.angle) * this.arm1factory;
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
        this.tubemesh.refresh(this.vectors, this.radius)
      }
      else {
        this.tubemesh.refresh(this.vectors, this.radius, true)
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
