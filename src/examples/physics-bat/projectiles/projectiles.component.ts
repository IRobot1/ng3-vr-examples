import { AfterViewInit, Component, Input, OnDestroy } from "@angular/core";

import { Camera, Object3D, Ray, Vector3 } from "three";

import { NgtStore, NgtTriple } from "@angular-three/core";

import { NgtPhysicBody, NgtPhysicBodyReturn } from "@angular-three/cannon";

class Projectile {
  constructor(public body: NgtPhysicBodyReturn<Object3D>, public ttl: number = 10) { }
}

@Component({
  selector: 'projectiles',
  templateUrl: './projectiles.component.html',
  providers: [NgtPhysicBody],
})
export class Projectiles implements AfterViewInit, OnDestroy {
  @Input() position = [0, 2, -3] as NgtTriple;

  projectiles: Array<Projectile> = [];
  ballRadius = 0.1;

  constructor(
    private physicBody: NgtPhysicBody,
    private store: NgtStore,
  ) { }

  private player!: Camera;
  private source!: Vector3;

  private cleanup_timer!: any;

  ngAfterViewInit(): void {
    this.player = this.store.get((s) => s.camera);
    this.source = new Vector3(this.position[0], this.position[1], this.position[2]);

    let count = 0;
    this.cleanup_timer = setInterval(() => {
      this.projectiles.forEach((item, index) => {
        item.ttl--;
        if (item.ttl <= 0) {
          this.projectiles.splice(index, 1)
        }
      })
      if (count >= 5) {
        this.shoot();
        count = -1;
      }
      count++;
    }, 1000);

  }

  ngOnDestroy(): void {
    clearInterval(this.cleanup_timer);
  }


  private getShootDirection(): Vector3 {
    const vector = this.source.clone();
    const ray = new Ray(this.source, vector.sub(this.player.position).normalize().negate())
    return ray.direction;
  }


  shoot() {
    const shootDirection = this.getShootDirection()

    const velocity = shootDirection.multiplyScalar(10).toArray();
    const ball = this.physicBody.useSphere(() => ({
      mass: 2,
      args: [this.ballRadius],
      position: this.position,
      velocity: velocity
    }));

    this.projectiles.push(new Projectile(ball));
  }
}
