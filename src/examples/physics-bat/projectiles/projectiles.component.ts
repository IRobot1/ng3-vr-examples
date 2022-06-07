import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";

import { Object3D, Ray, Vector3 } from "three";

import { NgtTriple } from "@angular-three/core";

import { NgtPhysicBody, NgtPhysicBodyReturn } from "@angular-three/cannon";
import { BatGame } from "../batgame.service";

class Projectile {
  constructor(public body: NgtPhysicBodyReturn<Object3D>, public ttl: number = 5, public active = false) { }
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
  ballRadius = 0.05;

  results!: string;

  constructor(
    private physicBody: NgtPhysicBody,
    private gamestate: BatGame,
  ) { }

  private projectilestart!: Vector3;

  private cleanup_timer!: any;

  private score = 0;
  private velocity!: Vector3;

  ngAfterViewInit(): void {
    this.projectilestart = new Vector3(this.position[0], this.position[1], this.position[2]);

    const homeplate = new Vector3(0, 1.5, 0);

    const ray = new Ray(this.projectilestart, this.projectilestart.clone().sub(homeplate).normalize().negate())
    this.velocity = ray.direction.multiplyScalar(10);

    for (let i = 0; i < 5; i++) {
      const ball = this.physicBody.useSphere(() => ({
        mass: 2,
        args: [this.ballRadius],
        position: [0, -i*10, 0], // start under the floor
        material: { restitution: 0.7, friction: 0.1 },
      }));
      this.projectiles.push(new Projectile(ball));
    }

    this.cleanup_timer = setInterval(() => {
      this.projectiles.forEach((item, index) => {
        if (item.active) {
          item.ttl--;
          if (item.ttl <= 0) {
            item.active = false;
            item.ttl = 5;
          }
        }
      })
      this.shoot();
    }, 1000);

    this.gamestate.gamestate$.subscribe(next => {
      if (next.remaining == 0) {
        this.results = `Game Over - Score: ${this.score}`;
      } else {

        this.results = `Score: ${next.score}, Remaining Balls: ${next.remaining}`;
      }
      this.score = next.score;
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.cleanup_timer);
  }


  private index = 0;
  private shoot() {
    if (this.index >= this.projectiles.length) {
      this.index = 0;
    }
    const projectile = this.projectiles[this.index];
    projectile.active = true;

    const api = projectile.body.api;
    api.position.copy(this.projectilestart);
    api.velocity.copy(this.velocity);


    this.fire.emit();
    this.index++;
  }
}
