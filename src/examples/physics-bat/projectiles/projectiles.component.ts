import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";

import { Camera, Object3D, Ray, Vector3 } from "three";

import { NgtStore, NgtTriple } from "@angular-three/core";

import { NgtPhysicBody, NgtPhysicBodyReturn } from "@angular-three/cannon";
import { BatGame } from "../batgame.service";

class Projectile {
  constructor(public body: NgtPhysicBodyReturn<Object3D>, public ttl: number = 5) { }
}

@Component({
  selector: 'projectiles',
  templateUrl: './projectiles.component.html',
  providers: [NgtPhysicBody],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Projectiles implements AfterViewInit, OnDestroy {
  @Input() position = [0, 2, -5] as NgtTriple;

  @Output() fire = new EventEmitter();

  projectiles: Array<Projectile> = [];
  ballRadius = 0.1;

  results!: string;

  constructor(
    private physicBody: NgtPhysicBody,
    private store: NgtStore,
    private gamestate: BatGame,
  ) { }

  private player!: Camera;
  private projectilestart!: Vector3;

  private cleanup_timer!: any;

  private score = 0;
  private remaining = 0;

  ngAfterViewInit(): void {
    this.player = this.store.get((s) => s.camera);
    this.projectilestart = new Vector3(this.position[0], this.position[1], this.position[2]);

    let waittoshoot = 0;
    this.cleanup_timer = setInterval(() => {
      this.projectiles.forEach((item, index) => {
        item.ttl--;
        if (item.ttl <= 0) {
          this.projectiles.splice(index, 1)
        }
      })
      if (waittoshoot >= 1) {
        if (this.remaining > 0) {
          this.shoot();
        }
        waittoshoot = -1;
      }
      waittoshoot++;

      if (this.remaining == 0 && this.projectiles.length == 0) {
        this.results = `Game Over - Score: ${this.score}`;
      }
    }, 1000);

    this.gamestate.gamestate$.subscribe(next => {
        this.results = `Score: ${next.score}, Remaining Balls: ${next.remaining}`;
      this.remaining = next.remaining;
      this.score = next.score;
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.cleanup_timer);
  }


  private getShootDirection(): Vector3 {
    const vector = this.projectilestart.clone();
    const ray = new Ray(this.projectilestart, vector.sub(this.player.position).normalize().negate())
    return ray.direction;
  }


  private shoot() {
    const shootDirection = this.getShootDirection()

    const velocity = shootDirection.multiplyScalar(10).toArray();
    const ball = this.physicBody.useSphere(() => ({
      mass: 2,
      args: [this.ballRadius],
      position: this.position,
      velocity: velocity
    }));

    this.projectiles.push(new Projectile(ball));
    this.fire.emit();
  }
}
