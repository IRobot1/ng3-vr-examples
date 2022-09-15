import { Box3, Mesh, Sphere, Vector3 } from "three";

import { OBB } from "three-stdlib";

export type CollideHint = 'box' | 'sphere';

export class Collider {
  colliding: Array<Collider> = [];

  constructor(public mesh: Mesh, public hint: CollideHint) { }
}

//
// Useful for collecting UI elements that don't collide with each other, but do collide with user's finger
// Volume of user's finger can be checked against these elements every frame.  Similar to a raycaster
//
// Best if all object's have names for easy identification during collide events
//


export class CollisionGroup {
  colliders: Array<Collider> = [];

  addCollider(target: Mesh, hint: CollideHint = 'box') {
    this.colliders.push(new Collider(target, hint));
  }

  removeCollider(item: Mesh) {
    // confirm target is in collider list
    const index = this.colliders.findIndex(x => x.mesh == item);
    if (index != -1) {
      const collider = this.colliders[index];
      // notify anything its colliding with, that collision has ended
      collider.colliding.forEach(item => {
        collider.mesh.dispatchEvent({ type: 'collideend', object: item.mesh });
      });

      collider.colliding.length = 0;

      // now target can be removed
      this.colliders.splice(index, 1);
    }
  }

  private colliding(source: Collider, target: Collider) {
    if (!target.colliding.includes(source)) {
      target.mesh.dispatchEvent({ type: 'collidebegin', object: source.mesh });
      source.mesh.dispatchEvent({ type: 'collidebegin', object: target.mesh });

      target.colliding.push(source);
      source.colliding.push(target);
    }
    else {
      target.mesh.dispatchEvent({ type: 'colliding', object: source.mesh });
      source.mesh.dispatchEvent({ type: 'colliding', object: target.mesh });
    }
  }

  private notcolliding(source: Collider, target: Collider) {
    if (target.colliding.includes(source)) {
      target.mesh.dispatchEvent({ type: 'collideend', object: source.mesh });
      target.colliding = target.colliding.filter(x => x !== source);

    }
    if (source.colliding.includes(target)) {
      source.mesh.dispatchEvent({ type: 'collideend', object: target.mesh });
      source.colliding = source.colliding.filter(x => x !== target);
    }
  }

  private _box = new Box3();
  private _obb = new OBB();

  public checkBoxCollision(source: Collider) {
    const sourcebox = this._box.setFromObject(source.mesh);
    
    this.colliders.forEach(item => {
      if (item.hint == 'box') {
        let box3 = item.mesh.geometry.boundingBox;
        if (!box3) {
          item.mesh.geometry.computeBoundingBox();
          box3 = item.mesh.geometry.boundingBox;
        }
        if (box3) {
          this._obb.fromBox3(box3)
          this._obb.halfSize.copy(box3.getSize(new Vector3())).multiplyScalar(0.5)
          this._obb.applyMatrix4(item.mesh.matrixWorld);

          if (this._obb.intersectsBox3(sourcebox)) {
            this.colliding(source, item);
          }
          else {
            this.notcolliding(source, item)
          }
        }
      }
      else if (item.mesh.geometry.boundingSphere) {
        this._sphere = item.mesh.geometry.boundingSphere;

        if (source.mesh.geometry.boundingBox) {
          this._obb.fromBox3(source.mesh.geometry.boundingBox)
          this._obb.applyMatrix4(source.mesh.matrixWorld);

          if (this._obb.intersectsSphere(this._sphere)) {
            this.colliding(source, item);
          }
          else {
            this.notcolliding(source, item)
          }
        }
      }
    });
  }

  private _sphere = new Sphere();

  public checkSphereCollision(source: Collider) {
    if (!source.mesh.geometry.boundingSphere) return;

    this._sphere = source.mesh.geometry.boundingSphere.clone();
    this._sphere.applyMatrix4(source.mesh.matrixWorld);

    this.colliders.forEach(item => {
      if (item.hint == 'box') {
        if (item.mesh.geometry.boundingBox) {

          this._obb.fromBox3(item.mesh.geometry.boundingBox)
          this._obb.applyMatrix4(item.mesh.matrixWorld);

          if (this._obb.intersectsSphere(this._sphere)) {
            this.colliding(source, item)
          }
          else {
            this.notcolliding(source, item)
          }
        }
      }
      else if (item.mesh.geometry.boundingSphere) {
        const sphere = item.mesh.geometry.boundingSphere.clone();
        sphere.applyMatrix4(item.mesh.matrixWorld);

        if (this._sphere.intersectsSphere(sphere)) {
          this.colliding(source, item)
        }
        else {
          this.notcolliding(source, item)
        }

      }
    });
  }

}
